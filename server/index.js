// ========== IMPORTS

const express = require('express');
const app = express();

const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const leaveRoom = require('./utils/leave-room');

// ========== MIDDLEWARE / PORT

app.use(cors());

const PORT = process.env.PORT || 3000;

// ========== SERVER CREATION

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

// ========== LISTEN FOR SERVER CONNECT/DISCONNECT

// bot creation
const CHAT_BOT = 'ChatBot';

let chatRoom = '';
let allUsers = [];

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  // current time
  const time = new Date(Date.now()).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // join room
  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room);
    console.log(`user with id: ${socket.id} joined room ${room}`);

    // bot join message to the room
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room.`,
      username: CHAT_BOT,
      time,
    });

    // bot welcome message to the user
    socket.emit('receive_message', {
      message: `Welcome, ${username}!`,
      username: CHAT_BOT,
      time,
    });

    // get a list of users in the current room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    // leave room
    socket.on('leave_room', (data) => {
      const { username, room } = data;
      socket.leave(room);
      allUsers = leaveRoom(socket.id, allUsers);

      // update the remaining users
      socket.to(room).emit('chatroom_users', allUsers);

      // bot user left message
      socket.to(room).emit('receive_message', {
        username: CHAT_BOT,
        message: `${username} has left the chat.`,
        time,
      });
      console.log(`${username} has left the chat`);
    });
  });

  // sending/receiving message object
  socket.on('send_message', (data) => {
    // send messages to client to display to all users
    socket.to(data.room).emit('receive_message', data);
  });

  // user disconnect
  socket.on('disconnect', () => {
    const user = allUsers.find((user) => user.id === socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      // update the remaining users
      socket.to(chatRoom).emit('chatroom_users', allUsers);

      // bot user disconnected message
      socket.to(chatRoom).emit('receive_message', {
        username: CHAT_BOT,
        message: `${user.username} has disconnected from the chat.`,
        time,
      });
      console.log(`${user.username} has disconnected from the chat.`);
    }
  });
});

// ========== PORT

server.listen(PORT, () => {
  console.log(`-----> SERVER RUNNING ON ${PORT}<-----`);
});
