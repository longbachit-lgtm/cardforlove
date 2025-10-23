const express = require("express");
const router = express.Router();
const courseController = require("../app/controllers/CourseController");

const authMiddleware = require("../app/sub/subFunc");
const isAuth = authMiddleware.isAuth;

router.get("/create", courseController.create);
router.post("/store", courseController.store);
router.get("/:id/edit", courseController.edit);
router.put("/:id", courseController.update);
router.patch("/:id/restore", courseController.restore);
router.delete("/:id", courseController.destroy);
router.delete("/:id/force", courseController.forceDestroy);
router.get("/:slug", isAuth, courseController.show);

module.exports = router;
