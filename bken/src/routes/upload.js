const express = require("express");
const router = express.Router();
const { upload, resizeImage } = require("../app/sub/upload");
const uploadController = require("../app/controllers/UploadController");
const { isAuth } = require("../app/sub/subFunc");

router.post(
  "/",
  isAuth,
  upload.single("image"),
  resizeImage,
  uploadController.uploadImage
);

module.exports = router;
