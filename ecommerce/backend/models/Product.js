// ============================================================
// models/Product.js — Mongoose Product Schema
//
// Concept from Lecture 7: This schema defines the structure
// of product documents stored in the MongoDB "products" collection.
// ============================================================

const mongoose = require("mongoose");

/**
 * ReviewSchema — Embedded sub-document for product reviews.
 *
 * Concept from Lecture 7: MongoDB supports embedded documents.
 * Instead of a separate Reviews collection, we embed reviews
 * inside the Product document. This is an intentional design
 * tradeoff: faster reads, but harder to query reviews globally.
 */
const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User document
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Concept from Lecture 4: Categories help filter products via query params
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Clothing",
        "Food",
        "Books",
        "Sports",
        "Home",
        "Other",
      ],
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    // Image URL stored after uploading to Cloudinary
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, // Used to delete from Cloudinary
    },

    // Embedded reviews array
    reviews: [ReviewSchema],

    // Computed rating fields — updated when reviews change
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // Reference to the admin who created this product
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ============================================================
// Text Index — Enables full-text search on title and description
//
// Concept from Lecture 4: MongoDB text indexes allow searching
// for keywords across multiple string fields efficiently.
// ============================================================
ProductSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
