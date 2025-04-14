// 📁 server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory storage (replace with DB for production)
const onlineUsers = new Map(); // userId => socket.id

// Event listeners
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Register user
  socket.on('registerUser', (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} is online.`);
    io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
  });

  // One-to-one message
// One-to-one message
socket.on('send_message', ({ from, to, message, roomId }) => {
  console.log("📨 Received 'send_message' event");
  console.log("📦 Payload:", { from, to, message, roomId });

  const targetSocketId = onlineUsers.get(to);

  const payload = {
    from,
    to,
    message,
    timestamp: Date.now(),
    roomId
  };

  if (targetSocketId) {
    console.log(`✅ Target user (${to}) is online with socket ID: ${targetSocketId}`);
    io.to(targetSocketId).emit('receive_message', payload);
    console.log(`📤 Message sent to socket ID: ${targetSocketId}`, payload);
  } else {
    console.log(`⚠️ User ${to} not online. Message can be queued or handled later.`);
  }
});



  // Typing indicator
  socket.on('typing', ({ to, from }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) io.to(targetSocketId).emit('typing', { from });
  });

  // Notifications
  socket.on('notify', ({ to, notification }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receiveNotification', notification);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      console.log(`❌ User ${userId} went offline.`);
      io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
    }
  });
});

// Start server
const PORT2 = process.env.PORT1 || 3001;
server.listen(PORT2, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT2}`);
});
