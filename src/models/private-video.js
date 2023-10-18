const mongoose = require('mongoose');


const privateVideoSchema = new mongoose.Schema({
    // Reference to the Comment model (foreign key)
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateComment',
    },
    user: {
      type: String,
      ref: 'user',
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
        type: String,
      },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String], // Array of strings
      
  },
  });

  module.exports = mongoose.model('PrivateVideo', privateVideoSchema);