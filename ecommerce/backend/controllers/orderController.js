

const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided." });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}`,
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image.url,
      });

      totalPrice += product.price * item.quantity;
    }

    
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }, 
      });
    }

  
    const notification = await Notification.create({
      user: req.user._id,
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been placed successfully!`,
      type: "order_placed",
      link: `/orders/${order._id}`,
    });

   
    if (req.io) {
      req.io.to(req.user._id.toString()).emit("notification", notification);
    }
    if (paymentMethod === "wave" || paymentMethod === "orange_money") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "title image");

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order.",
      });
    }

    res.status(200).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};


const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "name email");

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) {
    next(error);
  }
};


const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
    }
    await order.save();

    // Notify the customer about their order status change
    const notification = await Notification.create({
      user: order.user,
      message: `Your order #${order._id.toString().slice(-6).toUpperCase()} status updated to: ${orderStatus}`,
      type: "order_updated",
      link: `/orders/${order._id}`,
    });

    if (req.io) {
      req.io.to(order.user.toString()).emit("notification", notification);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to '${orderStatus}'`,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};


const getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Revenue grouped by month for the chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
