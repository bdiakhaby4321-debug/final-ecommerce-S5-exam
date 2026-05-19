const mongoose = require("mongoose");

/**
  * connectDB — Connects to MongoDB using Mongoose
 * Mongoose provides schema validation and simplifies
 * communication with MongoDB.
 */
const connectDB = async () => {
  try {
 
    const conn = await mongoose.connect(process.env.MONGO_URI) ;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Fail fast if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;