// app/sub/upload.js

const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
// Cấu hình nơi lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // đặt tên file
  },
});

// Chỉ cho phép một số loại file (tuỳ chọn)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

// Tạo middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
});

// ===== Resize & nén ảnh =====

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const outputPath = req.file.path; // giữ nguyên tên file
  await sharp(req.file.path)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(outputPath + "_tmp");
  fs.unlinkSync(req.file.path); // xóa file gốc
  fs.renameSync(outputPath + "_tmp", outputPath); // đổi tên file nén thành file gốc
  next();
};

module.exports = { upload, resizeImage };
