const mongoose = require('mongoose');

// Define message schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  replyTo: String,
  timestamp: { type: Date, default: Date.now }
});

// Create a model for messages
const Message = mongoose.model('Message', messageSchema);

// Save a message to the database
async function saveMessage(msg) {
  try {
    const newMessage = new Message(msg);
    await newMessage.save();
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

// Get all messages from the database
async function getMessages() {
  try {
    return await Message.find().sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

module.exports = { saveMessage, getMessages };
