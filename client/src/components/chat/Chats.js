import React, { useEffect, useState } from 'react';
import Messages from './Messages';
import RoomAndUsers from './RoomAndUsers';
import SendMessage from './SendMessage';
import LeaveRoom from './LeaveRoom';

function Chats({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        username: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }),
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

  return (
    <div className='chat-window'>
      <RoomAndUsers socket={socket} username={username} room={room} />
      <Messages messageList={messageList} username={username} room={room} />
      <SendMessage
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        sendMessage={sendMessage}
      />
      <LeaveRoom socket={socket} username={username} room={room} />
    </div>
  );
}

export default Chats;
