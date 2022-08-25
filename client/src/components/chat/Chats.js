import React, { useEffect, useState } from 'react';
import Messages from './Messages';
import RoomAndUsers from './RoomAndUsers';
import SendMessage from './SendMessage';

function Chats({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };
      // async/await the data to send to the server with socket.emit
      await socket.emit('send_message', messageData);

      // set own messages to the state as well
      setMessageList((prevList) => [...prevList, messageData]);
    }
    setCurrentMessage('');
  };

  useEffect(() => {
    // retrieves the data sent to the backend back to the frontend
    // run whenever socket is changed
    // set other user's messages to the state
    socket.on('receive_message', (data) => {
      setMessageList((prevList) => [...prevList, data]);
    });
  }, [socket]);

  // console.log('message list', messageList);

  return (
    <div className='chat-window'>
      <RoomAndUsers socket={socket} username={username} room={room} />
      <div className='chat-header'>
        <p>You are in room: {room}</p>
      </div>
      <Messages messageList={messageList} username={username} />
      <SendMessage
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default Chats;
