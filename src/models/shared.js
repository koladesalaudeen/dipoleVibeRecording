const mongoose = require("mongoose");

// Define the Comment schema
const SharedSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    privateVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "private-video",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Comment model
module.exports = mongoose.model("Shared", SharedSchema);
