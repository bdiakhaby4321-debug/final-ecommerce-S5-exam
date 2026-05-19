

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
