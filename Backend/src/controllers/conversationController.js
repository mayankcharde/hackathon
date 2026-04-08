import asyncHandler from '../utils/asyncHandler.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import Item from '../models/itemModel.js';

// ─────────────────────────────────────────────
// @desc    Start or get a conversation between founder and owner
// @route   POST /api/conversations
// @access  Private (Founder only)
// ─────────────────────────────────────────────
export const startConversation = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const proofImage = req.file ? req.file.path : ''; 
  
  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    itemId,
    founderId: req.user._id,
  });

  if (!conversation) {
    // Ensure the founder isn't the owner
    if (item.userId.toString() === req.user._id.toString()) {
       res.status(400);
       throw new Error('Owners cannot start conversations on their own items as founders');
    }

    conversation = await Conversation.create({
      itemId,
      ownerId: item.userId,
      founderId: req.user._id,
      proofImage,
    });
  } else if (proofImage) {
    // If conversation exists but we have a new proof image, update it
    conversation.proofImage = proofImage;
    await conversation.save();
  }

  // Populate before sending back to frontend
  conversation = await Conversation.findById(conversation._id)
    .populate('itemId', 'name image description status')
    .populate('ownerId', 'name email')
    .populate('founderId', 'name email');

  // Notify the owner that someone has found their item
  const io = req.app.get('socketio');
  if (io) {
    io.to(conversation.ownerId._id.toString()).emit('new_notification', {
      type: 'DISCOVERY_REPORT',
      conversationId: conversation._id,
      founderName: req.user.name,
      itemName: item.name,
      message: `Someone has reportedly found your ${item.name}! Check the proof and start chatting.`,
    });
  }

  res.status(200).json({
    success: true,
    data: conversation,
  });
});

// ─────────────────────────────────────────────
// @desc    Get all conversations for the logged-in user (Owner or Founder)
// @route   GET /api/conversations
// @access  Private
// ─────────────────────────────────────────────
export const getMyConversations = asyncHandler(async (req, res) => {
  // Relationship-based query: Show chats where user is either the owner or the founder
  const query = {
    $or: [{ ownerId: req.user._id }, { founderId: req.user._id }]
  };

  // Allow filtering by specific item (useful for Owner POV on ItemDetails page)
  if (req.query.itemId) {
    // Note: When filtering by itemId on the public details page, we usually want 
    // to search for others contacting us (ownerId) OR us contacting the owner (founderId).
    // The previous strict 'const query = ...' logic was too restrictive.
  }

  const conversations = await Conversation.find(query)
    .populate('itemId', 'name image')
    .populate('ownerId', 'name')
    .populate('founderId', 'name')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    data: conversations,
  });
});

// ─────────────────────────────────────────────
// @desc    Get messages for a specific conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
// ─────────────────────────────────────────────
export const getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Ensure user is part of the conversation
  if (
    conversation.ownerId.toString() !== req.user._id.toString() &&
    conversation.founderId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view these messages');
  }

  const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    data: messages,
  });
});
