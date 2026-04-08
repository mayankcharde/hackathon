import asyncHandler from '../utils/asyncHandler.js';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import { classifyMessage } from '../utils/aiUtils.js';

// ─────────────────────────────────────────────
// @desc    Send a message within a conversation
// @route   POST /api/messages
// @access  Private
// ─────────────────────────────────────────────
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, message, location } = req.body;

  if (!conversationId || !message) {
    res.status(400);
    throw new Error('Conversation ID and message are required');
  }

  // Check if conversation exists and user is part of it
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  if (
    conversation.ownerId.toString() !== req.user._id.toString() &&
    conversation.founderId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to send messages in this conversation');
  }

  // AI Spam Check - Fail-safe inside classifyMessage (defaults to SAFE on error)
  const spamVerdict = await classifyMessage(message);
  const isSpam = spamVerdict === 'SPAM';

  const newMessage = await Message.create({
    conversationId,
    senderId: req.user._id,
    message,
    location,
    isSpam,
  });

  // Update conversation last message metadata
  conversation.lastMessage = {
    text: message,
    senderId: req.user._id,
    timestamp: new Date(),
  };
  await conversation.save();

  // Real-time broadcast if message is safe
  if (!isSpam) {
    try {
      const io = req.app.get('socketio');
      if (io) {
        // Emit to the conversation-specific room
        io.to(conversationId).emit('receive_message', {
          _id: newMessage._id,
          conversationId,
          senderId: req.user._id,
          message,
          createdAt: newMessage.createdAt,
        });

        // Also notify the other party's general notification room
        const otherUserId = conversation.ownerId.toString() === req.user._id.toString() 
          ? conversation.founderId.toString() 
          : conversation.ownerId.toString();
          
        io.to(otherUserId).emit('new_notification', {
          type: 'CHAT_MESSAGE',
          conversationId,
          senderName: req.user.name,
          message: 'New message received',
        });
      }
    } catch (socketErr) {
      console.error('Socket broadcast failed, but message was saved:', socketErr.message);
      // We don't throw here to ensure the API still returns success since the DB saved the message
    }
  }

  res.status(201).json({
    success: true,
    data: newMessage,
  });
});

// ─────────────────────────────────────────────
// @desc    Get all messages for a conversation 
// ─────────────────────────────────────────────
export const getMyMessages = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Use /api/conversations to fetch chat history' });
});
