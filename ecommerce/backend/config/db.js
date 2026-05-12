// ============================================================
// config/db.js — Database Connection Configuration
//
// Concept from Lecture 7: MongoDB is a NoSQL document database.
// We use Mongoose as our ODM (Object Data Modeling) library,
// which lets us define schemas and interact with MongoDB using
// JavaScript objects instead of raw queries.
// ============================================================

const mongoose = require("mongoose");

/**
 * connectDB — Establishes a connection to MongoDB Atlas.
 *
 * Concept from Lecture 7:
 * Mongoose provides schema validation and simplifies
 * communication with MongoDB.
 */
const connectDB = async () => {
  try {
    // Modern Mongoose versions no longer require
    // useNewUrlParser or useUnifiedTopology

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Fail fast if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;