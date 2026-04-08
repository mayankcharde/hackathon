import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lastMessage: {
      text: String,
      senderId: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
    },
    proofImage: {
      type: String, // URL to the image uploaded by the founder
    },
    status: {
      type: String,
      enum: ['open', 'resolved', 'reported'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one conversation exists between an owner and a founder for a specific item
conversationSchema.index({ itemId: 1, founderId: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
