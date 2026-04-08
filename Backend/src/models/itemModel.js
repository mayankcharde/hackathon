import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Index for fast user-specific queries
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    image: {
      type: String, // URL or base64 string of the item image
      default: '',
    },
    qrCodeUrl: {
      type: String, // base64 encoded QR code image (data:image/png;base64,...)
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'lost', 'found', 'archived'],
        message: 'Status must be one of: active, lost, found, archived',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
