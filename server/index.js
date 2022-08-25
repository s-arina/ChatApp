// ========== IMPORTS

// require express and create an instance of it
const express = require('express');
const app = express();

// require http to connect server with socket.io
const http = require('http');

// socket.io deals with a lot of cors issues, this will help
const cors = require('cors');

// after the rest, import Server from socket.io library
const { Server } = require('socket.io');

// import the function
const leaveRoom = require('./utils/leave-room');

// ========== MIDDLEWARE / PORT

// invoke the middleware
app.use(cors());

// port to listen to
const PORT = process.env.PORT || 3000;

// ========== SERVER CREATION

// using the http library and pass the express app to generate the server
const server = http.createServer(app);

// new instance of the server class
// connect socket.io to the server created
const io = new Server(server, {
  // specify cors credentials/settings/etc if needed
  cors: {
    // which server is making the calls to our server (react server it will be running in)
    origin: 'http://localhost:3001',
    // allow specific requests
    methods: ['GET', 'POST'],
  },
});

// ========== LISTEN FOR SERVER CONNECT/DISCONNECT

const CHAT_BOT = 'ChatBot';

let chatRoom = '';
let allUsers = [];

// initiate and detect if someone has connected to the server
// listens for an event (connection)
io.on('connection', (socket) => {
  // runs a callback to give a user a specific id
  console.log('user connected:', socket.id);

  // current time
  const time = new Date(Date.now()).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  // ===> SOCKET.ON: bring the data from client side passed in over
  // ADD A USER TO A ROOM
  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room);
    console.log(`user with id: ${socket.id} joined room ${room}`);

    // send a message to the room for a newly joined user
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room.`,
      username: CHAT_BOT,
      time,
    });

    // send a welcome message to the person joining
    socket.emit('receive_message', {
      message: `Welcome, ${username}!`,
      username: CHAT_BOT,
      time,
    });

    // get the users of each room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    // ===> SOCKET.ON: bring the data from client side passed in over
    // LEAVING A ROOM
    socket.on('leave_room', (data) => {
      const { username, room } = data;
      socket.leave(room);

      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(room).emit('chatroom_users', allUsers);
      socket.to(room).emit('receive_message', {
        username: CHAT_BOT,
        message: `${username} has left the chat.`,
        time,
      });
      console.log(`${username} has left the chat`);
    });
  });

  // ===> SOCKET.ON:
  // SENDING MESSAGES
  socket.on('send_message', (data) => {
    // messageData object in Chats.js (room, username, message, time)
    // have the data only be available to users in the same room
    socket.to(data.room).emit('receive_message', data);
  });

  // ===> SOCKET.ON
  // WHEN A USER DISCONNECTS FROM THE SERVER
  socket.on('disconnect', () => {
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit('chatroom_users', allUsers);
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

// listen to a chosen port, check if it's running
// add "start": "nodemon index.js" script to package.json
// so nodemon will automatically restart the server every time there's changes, more efficient
server.listen(PORT, () => {
  console.log(`-----> SERVER RUNNING ON ${PORT}<-----`);
});
