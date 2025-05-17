const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  account_id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  joined_at: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  language: { type: String, default: "en" },
  notification_preferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("Member", memberSchema);