// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// Client routes
router.post("/", protect, authorize("client"), createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrder);

// Admin routes
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/admin/stats", protect, authorize("admin"), getOrderStats);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
