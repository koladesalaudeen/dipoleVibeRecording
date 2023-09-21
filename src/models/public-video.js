const mongoose = require('mongoose');


const publicVideoSchema = new mongoose.Schema({
    // Reference to the Comment model (foreign key)
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userEmail: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    videoTitle: {
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
        type: number,
      },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model('PublicVideo', publicVideoSchema);