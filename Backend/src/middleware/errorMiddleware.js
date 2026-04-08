/**
 * Custom Error Handler Middleware
 * Overrides Express's default error handler.
 * Sends a consistent JSON response for all errors.
 */
const errorHandler = (err, req, res, next) => {
  // Use the status code set on res, or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

/**
 * 404 Not Found Handler
 * Catches any requests that don't match a route.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
