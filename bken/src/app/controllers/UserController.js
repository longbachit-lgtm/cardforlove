const User = require("../models/User");
const { mongooseToObject } = require("../../util/mongoose");
const path = require("path");
const fs = require("fs");
class UserController {
  // [GET] /courses/:slug
  async editUser(req, res, next) {
    try {
      const username = req.body.username;

      // Lấy user từ DB
      const user = await User.findOne({ username });

      if (!user) return res.status(404).json({ message: "User not found" });

      // Cập nhật thông tin

      user.fullname = req.body.fullname;
      user.age = req.body.age;
      user.height = req.body.height;
      user.bmi = req.body.bmi;
      user.duration = req.body.duration;
      user.story = req.body.story;
    

      // Nếu có file ảnh mới thì xóa ảnh cũ
      if (req.body?.avatar) {
        const newAvatar = req.body.avatar;

        if (user.avatar && user.avatar !== newAvatar) {
          deleteOldImage(user.avatar);
        }
        user.avatar = newAvatar;
      }

      if (req.body?.beforeImg) {
        const newBefore = req.body.beforeImg;
        if (user.beforeImg && user.beforeImg !== newBefore) {
          deleteOldImage(user.beforeImg);
        }
        user.beforeImg = newBefore;
      }

      if (req.body?.afterImg) {
        const newAfter = req.body.afterImg;
        if (user.afterImg && user.afterImg !== newAfter) {
          deleteOldImage(user.afterImg);
        }
        user.afterImg = newAfter;
      }

      await user.save();
      res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUser(req, res, next) {
    try {
      const { username } = req.params;

      // Tìm user theo username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User fetched successfully",
        user: mongooseToObject(user),
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

function deleteOldImage(oldPath) {

  if (oldPath && oldPath.includes("/uploads/")) {
    const filePath = path.join(
      __dirname,
      "..", // quay về thư mục gốc server
      oldPath.replace("http://localhost:5000/", "")
    );

    fs.unlink(filePath, (err) => {
      if (err) console.error("Lỗi xóa ảnh cũ:", err);
    });
  }
}

module.exports = new UserController();
