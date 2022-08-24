// install socket.io-client
// used to establish a connection to the server
import io from 'socket.io-client';
import './App.css';
import React, { useState } from 'react';
import Chats from './Chats';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

const socket = io.connect('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path={`/${room}`}
            element={<Chats username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
