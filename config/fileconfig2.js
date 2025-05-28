const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Custom storage engine
class SharpDiskStorage {
  constructor(opts) {
    this.imageFolder = opts.imageFolder || "./uploads/images";
    this.videoFolder = opts.videoFolder || "./uploads/videos";
  }

  _handleFile(req, file, cb) {
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const randomString = crypto.randomBytes(6).toString("hex");
        const ext = path.extname(file.originalname);
        const filename = `${
          file.fieldname
        }-${Date.now()}-${randomString}${ext}`;
        let destFolder;

        // Determine folder based on mimetype
        if (file.mimetype.startsWith("image")) {
          destFolder = this.imageFolder;
          fs.mkdirSync(destFolder, { recursive: true });

          const filepath = path.join(destFolder, filename);
          // Process with sharp
          await sharp(buffer)
            .resize(1024, 1024, { fit: "inside" })
            .webp({ quality: 70 })
            .toFile(filepath);

          cb(null, { path: filepath, size: buffer.length, filename });
        } else if (file.mimetype.startsWith("video")) {
          destFolder = this.videoFolder;
          fs.mkdirSync(destFolder, { recursive: true });

          const filepath = path.join(destFolder, filename);
          // Save video buffer directly to disk
          fs.writeFileSync(filepath, buffer);

          cb(null, { path: filepath, size: buffer.length, filename });
        } else {
          cb(new Error("Unsupported file type"));
        }
      } catch (err) {
        cb(err);
      }
    });
    file.stream.on("error", (err) => cb(err));
  }

  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }
}

const storage = new SharpDiskStorage({
  imageFolder: "./uploads/images",
  videoFolder: "./uploads/videos",
});

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

const upload = multer({
  storage,
  limits: { fileSize: 2000000000 }, // 2 GB
  fileFilter,
}).fields([
  { name: "image", maxCount: 250 },
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "portfolio", maxCount: 250 },
  { name: "visitingCard", maxCount: 2 },
]);

module.exports = upload;
