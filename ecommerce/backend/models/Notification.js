

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["order_placed", "order_updated", "admin_message", "general"],
      default: "general",
    },
    read: {
      type: Boolean,
      default: false, // New notifications start as unread
    },
    // Optional link to related resource (e.g., order ID)
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
