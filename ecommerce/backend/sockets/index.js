


const jwt = require("jsonwebtoken")// ;

/**
 * initSocket — Initializes Socket.io event listeners
 *
 * @param {Object} io — the Socket.io server instance
 */
const initSocket = (io) => {

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
