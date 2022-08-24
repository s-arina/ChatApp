// install socket.io-client
// used to establish a connection to the server
import io from 'socket.io-client';
import './App.css';
import React from 'react';
import { useState } from 'react';
import Chats from './Chats';

const socket = io.connect('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  // connect the user on the server to socket.io room they want to join
  const joinRoom = () => {
    // if someone inputs a username and room name
    if (username && room) {
      // room is passed in as data in server/index.js
      socket.emit('join_room', room);
    }
  };

  return (
    <div className='App'>
      <h3>Join a Chat!</h3>
      <input
        type='text'
        placeholder='Me...'
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='text'
        placeholder='Room ID...'
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join a Room</button>
      <Chats socket={socket} username={username} room={room} />
    </div>
  );
}

export default App;
