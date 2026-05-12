// ============================================================
// models/User.js — Mongoose User Schema
//
// Concept from Lecture 7: A Mongoose Schema defines the shape
// of documents in a MongoDB collection. It acts like a blueprint
// that enforces data types, required fields, and default values.
//
// This is the "Model" layer of the MVC architecture (Lecture 8).
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * UserSchema — defines the structure of a User document.
 *
 * Concept from Lecture 7: MongoDB is schema-less by default,
 * but Mongoose lets us enforce a schema for data consistency.
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Remove leading/trailing whitespace
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Creates a unique index in MongoDB
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in query results by default
    },

    // Role-based access control (Lecture 6: Authorization)
    // "client" = regular user, "admin" = administrator
    role: {
      type: String,
      enum: ["client", "admin"], // Only these two values allowed
      default: "client",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      country: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
  },
  {
    // Concept from Lecture 7: timestamps automatically adds
    // createdAt and updatedAt fields to every document
    timestamps: true,
  }
);

// ============================================================
// Mongoose Pre-Save Hook — Hash Password Before Saving
//
// Concept from Lecture 6: We NEVER store plain-text passwords.
// bcrypt hashes passwords using a one-way hashing algorithm.
// A "salt" adds randomness to prevent rainbow table attacks.
//
// Concept from Lecture 7: Mongoose middleware (hooks) run
// before or after specific operations like save, find, etc.
// ============================================================
UserSchema.pre("save", async function (next) {
  // Only hash if the password field was modified (avoid double-hashing)
  if (!this.isModified("password")) return next();

  // Salt rounds = 12: higher = more secure but slower
  // bcrypt automatically generates and embeds a salt
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Continue to the next middleware or save operation
});

// ============================================================
// Instance Method — Compare Entered Password with Hashed Password
//
// Concept from Lecture 6: bcrypt.compare() uses the stored salt
// to hash the entered password and compares it with the stored hash.
// ============================================================
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
