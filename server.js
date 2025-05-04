// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Predefined users for login authentication
const USERS = {
  thor: 'pointbreak',
  jane: 'aether',
};

// Handle new client connections via Socket.IO
io.on('connection', (socket) => {
  console.log('a user connected');

  // Join event to assign username to the socket
  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} joined the chat`);
    socket.broadcast.emit('user-joined', username); // Notify others when a user joins
  });

  // Handle sending messages
  socket.on('send-message', (msg) => {
    io.emit('receive-message', msg); // Broadcast the message to all clients
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// Serve the app at http://localhost:3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

