const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const os = require("os");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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

        const ext = file.mimetype.startsWith("image") ? ".webp" : path.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}-${randomString}${ext}`;
        const destFolder = file.mimetype.startsWith("image") ? this.imageFolder : this.videoFolder;

        fs.mkdirSync(destFolder, { recursive: true });
        const finalPath = path.join(destFolder, filename);

        if (file.mimetype.startsWith("image")) {
          await sharp(buffer)
            .resize(1920, 1080, { fit: "inside" })
            .webp({ quality: 100 })
            .toFile(finalPath);

          const stats = fs.statSync(finalPath);
          cb(null, { path: finalPath, size: stats.size, filename });
        } else if (file.mimetype.startsWith("video")) {
          const tempInput = path.join(os.tmpdir(), `${randomString}-input.tmp`);
          fs.writeFileSync(tempInput, buffer);

          ffmpeg(tempInput)
            .outputOptions([
              "-vf scale=-1:720", // 720p height, keep aspect ratio
              "-preset fast",
              "-crf 28", // Quality setting (lower is better quality)
            ])
            .on("end", () => {
              fs.unlinkSync(tempInput);
              const stats = fs.statSync(finalPath);
              cb(null, { path: finalPath, size: stats.size, filename });
            })
            .on("error", (err) => cb(err))
            .save(finalPath);
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
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB limit
  fileFilter,
}).fields([
  { name: "image", maxCount: 250 },
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "portfolio", maxCount: 250 },
  { name: "visitingCard", maxCount: 2 },
]);

module.exports = upload;
