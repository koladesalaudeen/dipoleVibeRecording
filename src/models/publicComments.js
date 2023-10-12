const mongoose = require('mongoose');

// Define the Comment schema
const publicCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
  authorPaid: {
    type: Boolean,
    default: false
  },
  publicVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublicVideo', 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('PublicComment', publicCommentSchema);
