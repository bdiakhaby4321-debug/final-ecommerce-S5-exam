// ============================================================
// controllers/productController.js — Product Controller
//
// Concept from Lecture 8: MVC Controller layer.
// Handles all CRUD operations for products.
//
// CRUD = Create, Read, Update, Delete — fundamental database ops
// Concept from Lecture 7: All DB operations use Mongoose methods.
// ============================================================

const Product = require("../models/Product");
const { cloudinary } = require("../config/cloudinary");

// ============================================================
// @route   GET /api/v1/products
// @desc    Get all products with search, filter, sort, pagination
// @access  Public
//
// Concept from Lecture 4: Query parameters (?key=value) modify
// the behavior of a GET request without changing the URL path.
// Example: GET /api/v1/products?category=Electronics&sort=price&page=2
// ============================================================
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sortObj = { createdAt: -1 };
    if (sort === "price") sortObj = { price: 1 };
    if (sort === "-price") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { averageRating: -1 };

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select("-reviews");

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   GET /api/v1/products/:id
// @desc    Get single product with reviews
// @access  Public
// ============================================================
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   POST /api/v1/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
//
// Concept from Lecture 4: POST creates a new resource.
// Status 201 = Created (vs 200 = OK for reads)
// ============================================================
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock } = req.body;

    // Build image object if a file was uploaded via Multer + Cloudinary
    const image = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: "" };

    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   PUT /api/v1/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
//
// Concept from Lecture 4: PUT replaces/updates an existing resource.
// ============================================================
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { title, description, price, category, stock } = req.body;
    const updateData = { title, description, price, category, stock };

    // If a new image was uploaded, delete old one from Cloudinary
    if (req.file) {
      if (product.image.publicId) {
        await cloudinary.uploader.destroy(product.image.publicId);
      }
      updateData.image = { url: req.file.path, publicId: req.file.filename };
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   DELETE /api/v1/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
//
// Concept from Lecture 4: DELETE removes a resource permanently.
// ============================================================
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Delete associated image from Cloudinary to avoid orphaned files
    if (product.image.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @route   POST /api/v1/products/:id/reviews
// @desc    Add a review to a product
// @access  Private/Client
// ============================================================
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Recalculate average rating
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
