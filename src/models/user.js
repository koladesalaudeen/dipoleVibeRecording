const mongoose = require('mongoose');

// Define the Comment schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', 
  },
  shared: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shared', 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('User', UserSchema);
