const mongoose = require('mongoose');


const publicVideoSchema = new mongoose.Schema({
    // Reference to the Comment model (foreign key)
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userEmail: {
      type: String,
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
    videoURL:{
      type: String,
    },
    description: {
      type: String,
    },
    likes:{
      type: Map
    },
    views: {
        type: Number,
      },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model('PublicVideo', publicVideoSchema);