import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ username, room, socket, setUsername, setRoom }) {
  const navigate = useNavigate();

  // connect the user on the server to socket.io room they want to join
  const joinRoom = () => {
    // if someone inputs a username and room name
    if (username && room) {
      // room is passed in as data in server/index.js
      socket.emit('join_room', { username, room });
    }
    navigate(`/${room}`, { replace: true });
  };

  return (
    <div className='joinChatContainer'>
      <h3>Join a Chat!</h3>
      <form className='join-chat' onSubmit={joinRoom}>
        <input
          type='text'
          placeholder='Me...'
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select onChange={(e) => setRoom(e.target.value)} required>
          <option value=''>Select a room</option>
          <option value='eggs'>eggs</option>
          <option value='node'>node</option>
          <option value='express'>express</option>
          <option value='react'>react</option>
        </select>
        <button>Join a Room</button>
      </form>
    </div>
  );
}

export default Home;
