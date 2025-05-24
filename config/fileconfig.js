const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder;

    if (file.mimetype.startsWith("image")) {
      uploadFolder = "./uploads/images";
    } else if (file.mimetype.startsWith("video")) {
      uploadFolder = "./uploads/videos";
    } else {
      return cb(
        new Error("Invalid file type! Only images and videos are allowed.")
      );
    }

    // Ensure the directory exists
    fs.mkdirSync(uploadFolder, { recursive: true });
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Generate a random string
    const randomString = crypto.randomBytes(6).toString("hex");

    // Get the original file extension
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}-${randomString}${extension}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mkv|avi/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedImageTypes.test(extname) && mimetype.startsWith("image")) {
    cb(null, true);
  } else if (allowedVideoTypes.test(extname) && mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Error: Only image and video files are allowed!"));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000000 }, // 2 GB limit for videos, adjust as needed
  fileFilter: fileFilter,
}).fields([
  { name: "image", maxCount: 250 }, // Image field
  { name: "video", maxCount: 1 }, // Video field
  { name: "thumbnail", maxCount: 1 },
  { name: "portfolio", maxCount: 250 }, // Thumbnail field
  { name: "visitingCard", maxCount: 2 },
  // Video field
]);

module.exports = upload;
