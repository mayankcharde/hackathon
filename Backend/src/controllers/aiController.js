import asyncHandler from '../utils/asyncHandler.js';
import * as aiUtils from '../utils/aiUtils.js';

// @desc    Generate item details (name & description)
// @route   POST /api/ai/generate-description
// @access  Private
export const generateDescription = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400);
    throw new Error('Prompt is required');
  }
  const details = await aiUtils.generateItemDetails(prompt);
  res.status(200).json({ success: true, data: details });
});

// @desc    Generate finder message
// @route   POST /api/ai/generate-message
// @access  Public
export const generateMessage = asyncHandler(async (req, res) => {
  const { itemName } = req.body;
  if (!itemName) {
    res.status(400);
    throw new Error('Item name is required');
  }
  const message = await aiUtils.generateFinderMessage(itemName);
  res.status(200).json({ success: true, data: message });
});

// @desc    Suggest a reply for the owner
// @route   POST /api/ai/suggest-reply
// @access  Private
export const suggestReply = asyncHandler(async (req, res) => {
  const { finderName, messageText } = req.body;
  if (!finderName || !messageText) {
    res.status(400);
    throw new Error('Finder name and message text are required');
  }
  const suggestion = await aiUtils.suggestReply(finderName, messageText);
  res.status(200).json({ success: true, data: suggestion });
});
