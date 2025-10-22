const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, default: null },
  avatar: { type: String, default: null },
  age: { type: Number, default: null },
  height: { type: String, default: null },
  weightBefore: { type: String, default: null },
  weightAfter: { type: String, default: null },
  bmi: { type: String, default: null },
  duration: { type: String, default: null },
  story: { type: String, default: null },
  beforeImg: { type: String, default: null },
  afterImg: { type: String, default: null },
  accessToken: { type: String, default: null },
  refreshToken: { type: String, default: null },
});

// Add plugins
mongoose.plugin(slug);
User.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

User.statics.getUser = async function (username) {
  try {
    const user = await this.findOne({ username: username });
    return user;
  } catch (error) {
    return null;
  }
};

User.statics.updateRefreshToken = async function (username, refreshToken) {
  try {
    const user = await this.findOne({ username });

    if (user) {
      user.refreshToken = refreshToken;
      await user.save();
      return true;
    }
    return false;
  } catch (err) {
    console.error("Update access token error:", err);
    return false;
  }
};
module.exports = mongoose.model("User", User);
