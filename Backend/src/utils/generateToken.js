import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for a given user ID.
 * @param {string} id - The user's MongoDB ObjectId
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
