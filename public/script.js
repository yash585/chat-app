const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const peer = user === 'user1' ? 'user2' : 'user1';

socket.emit('join', user);
document.getElementById('chat-header').textContent = `Chatting with ${peer}`;

let replyTo = null;

function sendMessage() {
  const msgInput = document.getElementById('message');
  const text = msgInput.value;
  if (!text) return;

  const msg = {
    user,
    text,
    replyTo
  };

  socket.emit('send-message', msg);
  msgInput.value = '';
  replyTo = null;
}

socket.on('receive-message', (msg) => {
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
});

