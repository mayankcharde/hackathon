import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
