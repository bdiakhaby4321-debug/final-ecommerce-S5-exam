

const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs");


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

  
    role: {
      type: String,
      enum: ["client", "admin", "superadmin"],
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


UserSchema.pre("save", async function (next) {
  // Only hash if the password field was modified (avoid double-hashing)
  if (!this.isModified("password")) return next();


  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
