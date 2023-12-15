const mongoose = require("mongoose");

// Define the Comment schema
const SharedSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    recipientsMail: {
      type: [String],
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

// Create and export the Comment model
module.exports = mongoose.model("Shared", SharedSchema);
