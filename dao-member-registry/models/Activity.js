const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  type: { type: String, enum: ["buy", "transfer", "proposal", "vote"], required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);