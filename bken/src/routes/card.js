

// src/routes/targets.js
const express = require("express");
const router = express.Router();
const CardLoveController = require("../app/controllers/CardLoveController");
const { isAuth } = require("../app/sub/subFunc"); // giữ middleware bạn có

// List all (with pagination & search)
router.get("/", CardLoveController.index);

// List deleted (soft-deleted)
router.get("/deleted", CardLoveController.deleted);

// Get one by id
router.get("/:id", CardLoveController.show);

// Create
router.post("/", CardLoveController.store);

// Update (PUT or PATCH tuỳ bạn mount)
router.put("/:id", CardLoveController.update);

// Soft delete
router.delete("/:id", CardLoveController.destroy);

// Restore soft-deleted
router.patch("/:id/restore", CardLoveController.restore);

// Force delete permanently
router.delete("/:id/force", CardLoveController.forceDestroy);

module.exports = router;

