const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const CardLove = new Schema({
  person_one: { type: String, required: true },
  img_person_one: { type: String, required: true },
  person_two: { type: String, required: true },
  img_person_two: { type: String, required: true },
  start_date: { type: String, default: null },
  url_youtube: { type: String,  default: null },
  message: { type: String },
  message_color: { type: String, default: "gradient-romantic" },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Add plugins
mongoose.plugin(slug);
CardLove.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});


module.exports = mongoose.model("CardLove", CardLove);
