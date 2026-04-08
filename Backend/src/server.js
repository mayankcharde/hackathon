import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // User joins a private room based on their User ID for targeted notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their notification room.`);
  });

  // User joins a specific conversation room for real-time chat
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`💬 Joined Conversation Room: ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// Make io accessible globally if needed (via app.set or similar)
app.set('socketio', io);

// Connect to MongoDB, then start the server
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
    );
  });
};

startServer();
