const mongoose = require("mongoose");
const replySchema = require("./replyObject").reply;

// Define the Comment schema
const publicCommentSchema = new mongoose.Schema(
  {
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
      type: Boolean,
      default: false,
    },
    publicVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicVideo",
      required: true,
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

// Create and export the Comment model
module.exports = mongoose.model("PublicComment", publicCommentSchema);
