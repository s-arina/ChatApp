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
    // navigate user to the room route
    navigate(`/${room}`, { replace: true });
  };

  return (
    <div className='joinChatContainer'>
      <h3>Join a Chat!</h3>
      <form className='join-chat' onSubmit={joinRoom}>
        <input
          type='text'
          placeholder='Nickname'
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select onChange={(e) => setRoom(e.target.value)} required>
          <option value=''>Select a room</option>
          <option value='Room1'>Room1</option>
          <option value='Room2'>Room2</option>
          <option value='Room3'>Room3</option>
          <option value='Room4'>Room4</option>
        </select>
        <button>Join a Room</button>
      </form>
    </div>
  );
}

export default Home;
