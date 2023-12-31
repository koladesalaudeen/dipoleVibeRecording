const mongoose = require("mongoose");
const PublicComment = require("./publicComments");

const publicVideoSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicComment",
    },
    userEmail: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      type: String,
    },
    videoTitle: {
      type: String,
    },
    videoSummary: {
      type: String,
    },
    videoURL: {
      type: String,
    },
    transcription: {
      type: String,
    },
    description: {
      type: String,
    },
    likes: {
      type: Map,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
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

publicVideoSchema.pre("save", async function (next) {
  try {
    const commentCount = await PublicComment.countDocuments({
      PublicVideo: this._id,
    });
    this.commentCount = commentCount;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("PublicVideo", publicVideoSchema);
