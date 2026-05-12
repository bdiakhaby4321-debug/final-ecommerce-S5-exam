// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getDashboardStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// All user management routes are admin-only
router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;
