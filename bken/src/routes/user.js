const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const authMiddleware = require("../app/sub/subFunc");
const isAuth = authMiddleware.isAuth;

router.put("/edit",isAuth, userController.editUser);
router.get("/:username", isAuth, userController.getUser);

module.exports = router;
