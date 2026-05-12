// ============================================================
// server.js — Application Entry Point
//
// Concept from Lecture 3: This file starts the HTTP server and
// attaches Socket.io for real-time bidirectional communication.
//
// We separate app.js (Express config) from server.js (startup)
// because it makes testing easier — tests can import app.js
// without actually starting a server.
// ============================================================

require("dotenv").config(); // Load .env variables FIRST

const http = require("http");       // Node.js built-in HTTP module
const { Server } = require("socket.io"); // Socket.io WebSocket library
const app = require("./app");       // Express application
const connectDB = require("./config/db"); // MongoDB connection
const initSocket = require("./sockets/index"); // Socket.io handlers

const PORT = process.env.PORT || 5000;

// ============================================================
// Create HTTP server from Express app
//
// Concept from Lecture 3: We wrap Express in a raw HTTP server
// because Socket.io needs direct access to the HTTP server to
// "upgrade" connections from HTTP to WebSocket protocol.
// ============================================================
const httpServer = http.createServer(app);

// ============================================================
// Initialize Socket.io
//
// Concept from Lecture 3: Socket.io attaches to the HTTP server
// and handles WebSocket connections separately from HTTP routes.
// CORS must be configured for WebSocket connections too.
// ============================================================
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket event handlers
initSocket(io);

// ============================================================
// Make io accessible inside Express route handlers
//
// By attaching io to app, controllers can emit socket events:
// req.io.to(userId).emit("notification", data)
// ============================================================
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ============================================================
// Start the server
//
// We first connect to MongoDB, then start listening for HTTP
// requests. If DB connection fails, server won't start.
// ============================================================
const startServer = async () => {
  await connectDB(); // Connect to MongoDB Atlas

  httpServer.listen(PORT, () => {
    console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📡 REST API: http://localhost:${PORT}/api/v1
🔌 WebSocket: Socket.io active
🏥 Health: http://localhost:${PORT}/api/health
    `);
  });
};

startServer();

// Handle unhandled promise rejections (e.g. DB errors after startup)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  httpServer.close(() => process.exit(1));
});
