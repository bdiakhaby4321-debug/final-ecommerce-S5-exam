

const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Protected client routes
router.post("/:id/reviews", protect, authorize("client"), addReview);

// Admin-only routes — must be authenticated AND have admin role
router.post("/", protect, authorize("admin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
