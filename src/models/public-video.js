const mongoose = require('mongoose');


const publicVideoSchema = new mongoose.Schema({
    // Reference to the Comment model (foreign key)
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicComment',
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
    videoSummary : {
      type: String,
    },
    videoURL:{
      type: String,
    },
    transcription:{
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
        default: 0,
      },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model('PublicVideo', publicVideoSchema);