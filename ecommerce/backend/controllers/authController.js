// Controllers receive requests, process data using Models,
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload — stored inside the token
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};


const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);


  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};


const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please use a different email.",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
    });

    
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
const getMe = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phoneNumber, address },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
