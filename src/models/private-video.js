const mongoose = require("mongoose");
const PrivateComment = require("./privateComment");

const privateVideoSchema = new mongoose.Schema(
  {
    // Reference to the Comment model (foreign key)
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrivateComment",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      type: String,
      required: true,
    },
    videoTitle: {
      type: String,
    },
    videoURL: {
      type: String,
    },
    description: {
      type: String,
    },
    likes: {
      type: Map,
    },
    views: {
      type: String,
    },
    tags: {
      type: [String], // Array of strings
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

privateVideoSchema.pre("save", async function (next) {
  try {
    const commentCount = await PrivateComment.countDocuments({
      comment: this._id,
    });
    this.commentCount = commentCount;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("PrivateVideo", privateVideoSchema);
