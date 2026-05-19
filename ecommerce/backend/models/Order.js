

const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to Product model — allows .populate()
    required: true,
  },
  title: { type: String, required: true }, // Snapshot at time of purchase
  price: { type: Number, required: true }, // Snapshot at time of purchase
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed this order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Array of ordered items (each with product, quantity, price)
    items: [OrderItemSchema],

    // Shipping address snapshot at order time
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    // Payment information
    // Concept: Mock payment integration — Wave & Orange Money (West Africa)
    paymentMethod: {
      type: String,
      enum: ["wave", "orange_money", "cash_on_delivery"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Order lifecycle status
    // Concept: State machine — order moves through defined states
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
