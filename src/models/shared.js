const mongoose = require('mongoose');

// Define the Comment schema
const SharedSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'user',
    required: true,
  },
  privateVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'private-video', 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('Shared', SharedSchema);
