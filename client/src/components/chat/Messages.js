import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Messages({ messageList, username }) {
  return (
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
  );
}

export default Messages;
