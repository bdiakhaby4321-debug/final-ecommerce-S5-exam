// ============================================================
// routes/authRoutes.js
//
// Concept from Lecture 4: Express Router groups related routes.
// Concept from Lecture 5: Middleware chain — protect runs BEFORE
// the controller, acting as a gatekeeper.
//
// Route flow: Request → Router → Middleware → Controller → Response
// ============================================================

const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes — no authentication required
router.post("/register", register);
router.post("/login", login);

// Protected routes — JWT required
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);

module.exports = router;
