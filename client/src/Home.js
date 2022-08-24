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
      //   setShowChat(true);
    }
    navigate(`/${room}`, { replace: true });
  };

  return (
    // {!showChat ? (
    <div className='joinChatContainer'>
      <h3>Join a Chat!</h3>
      <input
        type='text'
        placeholder='Me...'
        onChange={(e) => setUsername(e.target.value)}
      />
      <select onChange={(e) => setRoom(e.target.value)}>
        <option>Select a room</option>
        <option value='eggs'>eggs</option>
        <option value='node'>node</option>
        <option value='express'>express</option>
        <option value='react'>react</option>
      </select>
      <button onClick={joinRoom}>Join a Room</button>
    </div>
    //   ) : (
    // <Chats socket={socket} username={username} room={room} />
    //   )}
    // </div>
  );
}

export default Home;
