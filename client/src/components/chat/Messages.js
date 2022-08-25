import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Messages({ messageList, username, room }) {
  console.log(messageList);
  return (
    <div className='chat-box'>
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
                  : username === msg.username
                  ? 'other'
                  : 'you'
              }
              key={msg.createdTime}
            >
              <div className='message-box'>
                <p id='username'>{msg.username}</p>
                <div className='message-content'>
                  <p>{msg.message}</p>
                </div>
                {/* <div className='message-meta'> */}
                <p id='time'>{msg.time}</p>
                {/* </div> */}
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
    </div>
  );
}

export default Messages;
