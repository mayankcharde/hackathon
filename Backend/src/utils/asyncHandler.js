/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express error middleware.
 * @param {Function} fn - Async Express route handler
 * @returns {Function} - Wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
