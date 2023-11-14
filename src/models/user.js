const mongoose = require("mongoose");

// Define the Comment schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    videoPrivate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrivateVideo",
      },
    ],
    videoPublic: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PublicVideo",
      },
    ],
    shared: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shared",
    },
    isPaidUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Comment model
module.exports = mongoose.model("User", UserSchema);
