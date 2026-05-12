// ============================================================
// middleware/upload.js — File Upload Middleware (Multer)
//
// Concept from Lecture 5: Multer is Express middleware that
// handles multipart/form-data, which is the encoding used
// when a form submits a file.
//
// Without Multer, Express cannot parse file data from requests.
// ============================================================

const multer = require("multer");
const { storage } = require("../config/cloudinary");

// Configure Multer to use Cloudinary as the storage engine
// Files go directly to Cloudinary — no local disk storage needed
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only image files are allowed"), false); // Reject
    }
  },
});

module.exports = upload;
