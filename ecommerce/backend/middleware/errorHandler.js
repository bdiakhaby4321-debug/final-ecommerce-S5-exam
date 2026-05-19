
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error(" ERROR:", err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  
  // Handle specific Mongoose/MongoDB errors
  
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

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};


const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); 
};

module.exports = { errorHandler, notFound };
