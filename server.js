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

// For persistence messages
const messages = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Handle user joining
  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} joined the chat`);
    
    // Send the existing messages to the new user
    socket.emit('load-messages', messages); 
    
    // Notify other users when a user joins
    socket.broadcast.emit('user-joined', username); 
  });

  // Handle sending messages
  socket.on('send-message', (msg) => {
    messages.push(msg); // Store message in memory
    
    // Broadcast the new message to all users
    io.emit('receive-message', msg); 
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
