const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrackingSchema = new Schema({
  date: { type: String, required: true },
  weight: Number,
  fat: Number,
  bone: Number,
  water: Number,
  muscle: Number,
  balanceIndex: Number,
  rmr: Number,
  bioAge: Number,
  visceralFat: Number,
  waist: Number,
});

const Target = new Schema(
  {
    username: { type: String, required: true, index: true }, // hoặc userId
    goals: {
      steps: Number,
      targetWeight: Number,
      targetCalories: Number,
      sleepHours: Number,
      finishMonths: Number,
    },
    tracking: [TrackingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Target", Target);
