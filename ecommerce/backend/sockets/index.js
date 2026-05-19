// ============================================================
// sockets/index.js — Socket.io Real-Time Event Handler
//
// Concept from Lecture 3: WebSockets vs HTTP
//
// HTTP:    Client sends request → Server responds → Connection closes
//          One-directional per request. Stateless.
//
// WebSocket: Persistent two-way connection between client and server.
//            Server can PUSH data to client without a request.
//            Perfect for: notifications, chat, live updates.
//
// Socket.io is a library that wraps WebSockets with fallbacks
// and adds features like rooms and namespaces.
// ============================================================


const jwt = require("jsonwebtoken")// ;

/**
 * initSocket — Initializes Socket.io event listeners
 *
 * @param {Object} io — the Socket.io server instance
 */
const initSocket = (io) => {
  // ============================================================
  // Middleware: Authenticate socket connections with JWT
  //
  // Concept from Lecture 6: We authenticate WebSocket connections
  // just like HTTP requests — using JWT tokens.
  // The token is sent in the socket handshake auth object.
  // ============================================================
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // Attach userId to socket instance
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) =>  {
    console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.userId})`);

    // ============================================================
    // Rooms: Each user joins a room named after their userId.
    // This allows us to send notifications to a SPECIFIC user
    // instead of broadcasting to everyone.
    //
    // Concept from Lecture 3: Socket.io rooms are like private channels.
    // io.to(userId).emit() sends to all sockets in that room.
    // ============================================================
    socket.join(socket.userId);
    console.log(`👤 User ${socket.userId} joined their room`);

    // Listen for client disconnection
    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });

    // Custom event: client acknowledges a notification
    socket.on("notification_read", (notificationId) => {
      console.log(`📖 Notification ${notificationId} read by ${socket.userId}`);
    });
  });
};

module.exports = initSocket;
