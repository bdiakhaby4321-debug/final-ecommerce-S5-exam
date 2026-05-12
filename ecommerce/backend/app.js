// ============================================================
// app.js — Express Application Configuration
//
// Concept from Lecture 2: Monolithic Architecture
// All features (auth, products, orders, users) are in ONE app.
// This contrasts with microservices where each feature would
// be a separate deployed service.
//
// Why monolith here?
// ✅ Simpler to build and understand
// ✅ Easier to deploy (single process)
// ✅ Less networking overhead
// ✅ Easier debugging
// ⚠️ Harder to scale individual parts at high traffic
//
// Concept from Lecture 3: Client-Server Architecture
// This Express app IS the server. It listens for HTTP requests
// from the React frontend (client) and responds with JSON data.
// ============================================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import route files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Import error handling middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// ============================================================
// Global Middleware — runs on EVERY request
//
// Concept from Lecture 5: Middleware is software that sits between
// the request and response. Express processes middleware in order.
//
// Flow: Request → cors() → morgan() → express.json() → Routes → Response
// ============================================================

// CORS: Allow cross-origin requests from the React frontend
// Concept from Lecture 3: Browsers block requests from different origins
// by default (Same-Origin Policy). CORS headers allow it explicitly.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies/auth headers
  })
);

// Morgan: HTTP request logger middleware
// Logs method, URL, status code, and response time
// Concept from Lecture 5: Logging helps with debugging and monitoring
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Parse incoming JSON request bodies
// Concept from Lecture 3: HTTP request body contains data sent by client
// Without this, req.body would be undefined
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API Routes — versioned as /api/v1/
//
// Concept from Lecture 4: API versioning (/v1/) allows future
// breaking changes without breaking existing clients.
// ============================================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Health check endpoint — useful for deployment monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Error Handling Middleware — must be LAST
//
// Concept from Lecture 5: Express identifies error middleware
// by its 4-parameter signature (err, req, res, next).
// It's placed after all routes to catch any errors.
// ============================================================
app.use(notFound);      // 404 handler for undefined routes
app.use(errorHandler);  // Global error handler

module.exports = app;
