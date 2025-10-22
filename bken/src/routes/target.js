// src/routes/targets.js
const express = require("express");
const router = express.Router();
const targetCtrl = require("../app/controllers/TargetController");
const { isAuth } = require("../app/sub/subFunc"); // giữ middleware bạn có

router.get("/:username", isAuth, targetCtrl.getTargets);
router.put("/:username", isAuth, targetCtrl.updateTargets);

module.exports = router;