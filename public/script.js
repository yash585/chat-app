const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const peer = user === 'thor' ? 'jane' : 'thor';

socket.emit('join', user);
document.getElementById('chat-header').textContent = `Chatting with ${peer}`;

let replyTo = null;

// This function will handle appending messages to the chat UI
function displayMessage(msg) {
  const messages = document.getElementById('messages');
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.classList.add(msg.user === user ? 'sent' : 'received');

  if (msg.replyTo) {
    const replyDiv = document.createElement('div');
    replyDiv.classList.add('reply');
    replyDiv.textContent = `Reply to: ${msg.replyTo}`;
    msgDiv.appendChild(replyDiv);
  }

  const textDiv = document.createElement('div');
  textDiv.textContent = msg.text;
  msgDiv.appendChild(textDiv);

  msgDiv.onclick = () => {
    replyTo = msg.text;
    document.getElementById('message').focus();
  };

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// This function sends the message to the server
function sendMessage() {
  const msgInput = document.getElementById('message');
  const text = msgInput.value;
  if (!text) return;

  const msg = {
    user,
    text,
    replyTo
  };

  socket.emit('send-message', msg);  // Send message to the server
  msgInput.value = '';  // Clear the input field
  replyTo = null;  // Reset reply
}

// Receive and display messages from the server
socket.on('receive-message', (msg) => {
  displayMessage(msg);
});

// When a new user joins, load all existing messages
socket.on('load-messages', (msgs) => {
  msgs.forEach((msg) => {
    displayMessage(msg);
  });
});
