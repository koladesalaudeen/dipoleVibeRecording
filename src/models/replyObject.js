const mongoose = require("mongoose");
const reply = {
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  authorPaid: {
    type: Boolean, // Assuming authorPaid is a boolean for replies
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
};

module.exports = {
  reply,
};
