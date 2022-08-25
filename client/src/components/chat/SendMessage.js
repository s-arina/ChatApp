import React from 'react';

function SendMessage({ currentMessage, setCurrentMessage, sendMessage }) {
  return (
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
  );
}

export default SendMessage;
