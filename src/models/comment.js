const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorPaid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for paid users
  },
  privateVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'private-video', 
    required: true,
  },
  publicVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'public-video', 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('Comment', commentSchema);
