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
  // const [showChat, setShowChat] = useState(false);

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
        {/* {!showChat ? (
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
        ) : (
          <Chats socket={socket} username={username} room={room} />
        )}*/}
      </div>
    </Router>
  );
}

export default App;
