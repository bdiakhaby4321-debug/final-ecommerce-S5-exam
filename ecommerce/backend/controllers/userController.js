const User = require("../models/User");
const Order = require("../models/Order");


const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};


const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["client", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    // Find the user first to check their current role
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Prevent anyone from changing the superadmin's role
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin role cannot be changed.",
      });
    }

    // Only superadmin can promote someone to admin
    if (role === "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can promote users to admin.",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to '${role}'`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};


const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Prevent anyone from deleting the superadmin
    if (user.role === "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Super admin cannot be deleted.",
      });
    }

    // Regular admins cannot delete other admins — only superadmin can
    if (user.role === "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can delete admin accounts.",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "client" });
    const totalProducts = (await require("../models/Product").countDocuments()) || 0;
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUser, updateUserRole, deleteUser, getDashboardStats };