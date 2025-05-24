const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema); 