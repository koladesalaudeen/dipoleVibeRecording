const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', 
    required: true,
  },
  shared: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shared', 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('Comment', commentSchema);
