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

// ==========

// using the http library and pass the express app to generate the server
const server = http.createServer(app);

// new instance of the server class
// connect socket.io to the server created
const io = new Server(server, {
  // specify cors credentials/settings/etc if needed
  cors: {
    // which server is making the calls to our server (react server it will be running in)
    origin: 'http://localhost:3000',
    // allow specific requests
    methods: ['GET', 'POST'],
  },
});

// listen to a chosen port, check if it's running
// add "start": "nodemon index.js" script to package.json
// so nodemon will automatically restart the server every time there's changes, more efficient
server.listen(3001, () => {
  console.log('-----> SERVER RUNNING <-----');
});
