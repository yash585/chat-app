// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const messageService = require('./message'); // Import message service

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
  jarvis: 'ironsheart'
  veronica: 'hulkbuster'
};

// Connect to MongoDB
const mongoURI = 'mongodb+srv://yashchavhan566:Cipher567@bifrost.wp903ar.mongodb.net/?retryWrites=true&w=majority&appName=Bifrost'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining
  socket.on('join', async (username) => {
    socket.username = username;
    console.log(`${username} joined the chat`);
    
    // Fetch and send existing messages from the database to the new user
    const messages = await messageService.getMessages();
    socket.emit('load-messages', messages);

    // Notify other users when a user joins
    socket.broadcast.emit('user-joined', username);
  });

  // Handle sending messages
  socket.on('send-message', async (msg) => {
    // Save the new message to the database
    await messageService.saveMessage(msg);
    
    // Broadcast the new message to all users
    io.emit('receive-message', msg);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Serve the app at http://localhost:3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
