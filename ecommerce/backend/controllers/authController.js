// ============================================================
// controllers/authController.js — Authentication Controller
//
// Concept from Lecture 8: MVC Architecture
// - Model: User.js (data structure + database interaction)
// - View: Frontend React components
// - Controller: THIS FILE — handles business logic
//
// Controllers receive requests, process data using Models,
// and return responses. They are the "C" in MVC.
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ============================================================
// Helper Function — Generate JWT Token
//
// Concept from Lecture 6: JWT is created by encoding a payload
// (user ID) with a secret key. The token expires after a set time.
//
// jwt.sign(payload, secret, options) creates the token.
// The payload is NOT encrypted — it's base64 encoded.
// The signature prevents tampering.
// ============================================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload — stored inside the token
    process.env.JWT_SECRET, // Secret key — kept private on the server
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token lifespan
  );
};

/**
 * Helper — Send token response to the client
 * Concept: Consistent response format (Lecture 4)
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Remove password from response (even though select:false hides it,
  // we set it to undefined as an extra security measure)
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token, // Client stores this token (localStorage or memory)
    data: { user },
  });
};

// ============================================================
// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
//
// Concept from Lecture 4: POST method is used to CREATE resources.
// We create a new User document in MongoDB.
// ============================================================
const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if user already exists (duplicate email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please use a different email.",
      });
    }

    // Create the user — password hashing happens in the pre-save hook
    // (see models/User.js for the bcrypt logic)
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
    });

    // Send back the JWT token so the user is immediately logged in
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};

// ============================================================
// @route   POST /api/v1/auth/login
// @desc    Login user and return JWT
// @access  Public
//
// Concept from Lecture 6: Authentication flow:
// 1. User sends email + password
// 2. We find the user by email
// 3. We compare hashed passwords with bcrypt
// 4. If valid, we sign and return a JWT
// ============================================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user — we must explicitly select password (it's hidden by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Use a vague error message to prevent email enumeration attacks
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Compare entered password with hashed password using bcrypt
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   GET /api/v1/auth/me
// @desc    Get currently logged-in user's profile
// @access  Private (requires JWT)
// ============================================================
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   PUT /api/v1/auth/update-profile
// @desc    Update user profile
// @access  Private
// ============================================================
const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, address } = req.body;

    // Only update fields that were sent — use $set to avoid
    // overwriting the entire document (MongoDB operator)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phoneNumber, address },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on update
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
