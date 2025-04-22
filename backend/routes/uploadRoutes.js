const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pics", // optional folder name in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// @route POST /api/upload/profile
// @desc Upload profile picture to Cloudinary
router.post("/profile", protect, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    res.json({
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
