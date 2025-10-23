// src/app/controllers/TargetController.js
const Target = require("../models/Target");

// GET /targets  -> lấy goals + tracking cho user hiện tại
exports.getTargets = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) return res.status(401).json({ error: "No user" });

    let doc = await Target.findOne({ username });
    if (!doc) {
      // trả default nếu chưa có
      return res.json({ goals: null, tracking: [] });
    }
    return res.json({ goals: doc.goals, tracking: doc.tracking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /targets  -> cập nhật goals + tracking (ghi đè)
exports.updateTargets = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(401).json({ error: "No user" });
    }

    let { goals, tracking } = req.body;
  

    const doc = await Target.findOneAndUpdate(
      { username },
      { $set: { goals: goals || {}, tracking: tracking || [] } },
      { upsert: true, new: true }
    );

    res.json({ message: "Updated", doc });
  } catch (err) {
    console.error("Update Targets Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
