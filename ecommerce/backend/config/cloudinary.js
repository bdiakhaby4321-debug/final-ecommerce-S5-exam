
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage engine to upload directly to Cloudinary
//Multer is middleware for handling
// multipart/form-data (file uploads in HTTP requests)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-products", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

module.exports = { cloudinary, storage };
