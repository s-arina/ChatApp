import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import RoomAndUsers from './RoomAndUsers';

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
    // run whenever socket is changed
    // set other user's messages to the state
    socket.on('receive_message', (data) => {
      setMessageList((prevList) => [...prevList, data]);
    });
  }, [socket]);

  console.log('message list', messageList);

  return (
    <div className='chat-window'>
      <RoomAndUsers socket={socket} username={username} room={room} />
      <div className='chat-header'>
        <p>You are in room: {room}</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((msg) => (
            <div
              className='message'
              // if the user sent the message, change class style accordingly
              id={
                msg.username === 'ChatBot'
                  ? 'chatbot'
                  : username === msg.author
                  ? 'other'
                  : 'you'
              }
              key={msg.createdTime}
            >
              <div>
                <div className='message-content'>
                  <p>{msg.message}</p>
                </div>
                <div className='message-meta'>
                  <p id='time'>{msg.time}</p>
                  <p id='author'>{msg.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          placeholder='Hey...'
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chats;
