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

// use the middleware
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

// initiate and detect if someone has connected to the server
// listens for an event (connection)
io.on('connection', (socket) => {
  // runs a callback to give a user a specific id
  console.log('user connected:', socket.id);

  // ===> SOCKET.ON: bring the data from client side passed in over
  // ADD A USER TO A ROOM
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`user with id: ${socket.id} joined room ${data}`);
  });

  // ===> SOCKET.ON: sending message data sent from a user
  // SENDING MESSAGES
  socket.on('send_message', (data) => {
    console.log(data);

    // have the data only be available to users in the same room
    socket.to(data.room).emit('receive_message', data);
  });

  // ===> SOCKET.ON: runs when someone disconnects from the server
  // WHEN A USER LEAVES THE SERVER
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

// ========== PORT

// listen to a chosen port, check if it's running
// add "start": "nodemon index.js" script to package.json
// so nodemon will automatically restart the server every time there's changes, more efficient
server.listen(PORT, () => {
  console.log(`-----> SERVER RUNNING ON ${PORT}<-----`);
});
