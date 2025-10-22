const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const CardLove = new Schema({
  person_one: { type: String, required: true },
  img_person_one: { type: String, default: null },
  person_two: { type: String, required: true },
  img_person_two: { type: String, default: null },
  day_loved: { type: String, default: null },
  date_loved: { type: String, default: null },
  url_youtube: { type: String, default: null }
});

// Add plugins
mongoose.plugin(slug);
CardLove.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});


module.exports = mongoose.model("CardLove", CardLove);
