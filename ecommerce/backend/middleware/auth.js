// ============================================================
// middleware/auth.js — Authentication & Authorization Middleware
//
// Concept from Lecture 5: Middleware sits between the incoming
// HTTP request and the route handler. It can inspect, modify,
// or reject the request before it reaches the controller.
//
// Flow: Request → auth middleware → route handler → response
//
// Concept from Lecture 6:
// - Authentication = verifying WHO you are (JWT verification)
// - Authorization  = verifying WHAT you're allowed to do (roles)
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// protect — Authentication Middleware
//
// Concept from Lecture 6: JWT (JSON Web Token) is a stateless
// authentication mechanism. The token encodes user information
// and is signed with a secret key. The server does NOT store
// session data — this is what makes JWTs "stateless".
//
// JWT Structure: header.payload.signature
// - Header: algorithm used (HS256)
// - Payload: user data (id, role, email)
// - Signature: prevents tampering
// ============================================================
const protect = async (req, res, next) => {
  let token;

  // Tokens are sent in the Authorization header as: "Bearer <token>"
  // This is the standard Bearer Token authentication scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found, reject the request
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please log in.",
    });
  }

  try {
    // Verify the token using our secret key
    // jwt.verify() throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object for downstream use
    // We fetch fresh user data to ensure the user still exists
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    next(); // ✅ User is authenticated — proceed to route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// ============================================================
// authorize — Role-Based Authorization Middleware (RBAC)
//
// Concept from Lecture 6: After authentication, we check if
// the user has the required role to access this resource.
//
// Usage: router.delete('/products/:id', protect, authorize('admin'), ...)
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    // superadmin always has access to everything
    if (req.user.role === "superadmin") return next();

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
