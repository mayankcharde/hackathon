import asyncHandler from '../utils/asyncHandler.js';
import generateQRCode from '../utils/generateQRCode.js';
import Item from '../models/itemModel.js';

// ─────────────────────────────────────────────
// @desc    Create a new item with QR code
// @route   POST /api/items
// @access  Private (JWT required)
// ─────────────────────────────────────────────
const createItem = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;
  const image = req.file ? req.file.path : ''; // Use path from Cloudinary storage via Multer

  if (!name) {
    res.status(400);
    throw new Error('Item name is required');
  }

  // Save item first to get its MongoDB _id
  const item = await Item.create({
    userId: req.user._id,
    name,
    description,
    image,
    status,
  });

  // Generate QR code encoding the item's unique URL for direct scanning/redirection
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const qrCodeUrl = await generateQRCode(`${frontendUrl}/item/${item._id}`);

  // Persist the generated QR code back to the document
  item.qrCodeUrl = qrCodeUrl;
  await item.save();

  res.status(201).json({
    success: true,
    data: item,
  });
});

// ─────────────────────────────────────────────
// @desc    Get all items belonging to the logged-in user
// @route   GET /api/items
// @access  Private (JWT required)
// ─────────────────────────────────────────────
const getMyItems = asyncHandler(async (req, res) => {
  // Optional query filters
  const filter = { userId: req.user._id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const items = await Item.find(filter).sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

// ─────────────────────────────────────────────
// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
// ─────────────────────────────────────────────
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    'userId',
    'name email' // Only expose safe user fields
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// ─────────────────────────────────────────────
// @desc    Update an item (owner only)
// @route   PUT /api/items/:id
// @access  Private (JWT required)
// ─────────────────────────────────────────────
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Ensure only the owner can update
  if (item.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this item');
  }

  const { name, description, image, status } = req.body;

  item.name = name ?? item.name;
  item.description = description ?? item.description;
  item.image = image ?? item.image;
  item.status = status ?? item.status;

  const updatedItem = await item.save();

  res.status(200).json({
    success: true,
    data: updatedItem,
  });
});

// ─────────────────────────────────────────────
// @desc    Delete an item (owner only)
// @route   DELETE /api/items/:id
// @access  Private (JWT required)
// ─────────────────────────────────────────────
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Ensure only the owner can delete
  if (item.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this item');
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Item removed successfully',
  });
});

export { createItem, getMyItems, getItemById, updateItem, deleteItem };
