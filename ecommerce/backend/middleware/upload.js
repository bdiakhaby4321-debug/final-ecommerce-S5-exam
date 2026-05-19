

const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
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
