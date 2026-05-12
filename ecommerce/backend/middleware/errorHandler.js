// ============================================================
// middleware/errorHandler.js — Centralized Error Handler
//
// Concept from Lecture 5: Express has a special 4-parameter
// middleware signature (err, req, res, next) that catches errors
// passed via next(error) from any route or middleware.
//
// Centralized error handling means we handle all errors in ONE
// place instead of duplicating try/catch logic everywhere.
// ============================================================

/**
 * errorHandler — Global error handling middleware.
 *
 * Concept from Lecture 5: When any middleware or controller calls
 * next(error), Express skips all remaining middleware and calls
 * this function directly.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("🔴 ERROR:", err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ============================================================
  // Handle specific Mongoose/MongoDB errors
  // ============================================================

  // CastError — invalid MongoDB ObjectId format
  // Example: GET /api/v1/products/not-a-valid-id
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error (MongoDB error code 11000)
  // Example: Registering with an email that already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `${field} already exists. Please use a different value.`;
  }

  // Validation error — Mongoose schema validation failed
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // ============================================================
  // Concept from Lecture 4: HTTP Status Codes
  // 200 = OK, 201 = Created, 400 = Bad Request,
  // 401 = Unauthorized, 403 = Forbidden, 404 = Not Found,
  // 500 = Internal Server Error
  // ============================================================
  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * notFound — 404 handler for undefined routes
 *
 * Placed AFTER all routes to catch any request that didn't
 * match a defined route.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Pass to errorHandler
};

module.exports = { errorHandler, notFound };
