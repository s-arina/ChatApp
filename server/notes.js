// ========== INSTALL

// /server npm init
// npm i express nodemon cors socket.io

// ========== IMPORTS

// require express and create an instance of it
const express = require('express');
const app = express();

// require http to connect server with socket.io
const http = require('http');

// socket.io deals with a lot of cors issues, this will help
const cors = require('cors');

// import Server from socket.io library
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

// create a bot
const CHAT_BOT = 'ChatBot';

// initialize variables to be used
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
    // join method
    socket.join(room);
    console.log(`user ${username} with id: ${socket.id} joined room ${room}`);

    // BOT: send a message to all in the room for a newly joined user
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room.`,
      username: CHAT_BOT,
      time,
    });

    // BOT: send a welcome message to the person joining
    socket.emit('receive_message', {
      message: `Welcome, ${username}!`,
      username: CHAT_BOT,
      time,
    });

    // get the users of each room
    // set chatRoom to be the connected room
    chatRoom = room;
    // push all user data (id/name/room) into an array
    allUsers.push({ id: socket.id, username, room });
    // create a new array with user info belonging to the respective room
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    // send the data back to client side (RoomAndUsers.js)
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);

    // ===> SOCKET.ON: bring the data from client side passed in over
    // LEAVING A ROOM
    socket.on('leave_room', (data) => {
      const { username, room } = data;
      // leave method
      socket.leave(room);
      // call the imported function for filtering out a user
      allUsers = leaveRoom(socket.id, allUsers);

      // update the remaining users in the room
      socket.to(room).emit('chatroom_users', allUsers);
      // BOT: send a message for a leaving user
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
  // WHEN A USER DISCONNECTS FROM THE SERVER (closes tab/window, etc)
  socket.on('disconnect', () => {
    // find the user in the array based on socket id
    const user = allUsers.find((user) => user.id == socket.id);

    // if the user has a username associated with it
    if (user?.username) {
      // use the imported function to filter them out
      allUsers = leaveRoom(socket.id, allUsers);

      // update the remaining users
      socket.to(chatRoom).emit('chatroom_users', allUsers);

      // BOT: send a message to the chat about the disconnected user
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
