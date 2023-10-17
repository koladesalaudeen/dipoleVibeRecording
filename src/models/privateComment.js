const mongoose = require('mongoose');
const replySchema = require('./replyObject').reply

// Define the Comment schema
const privateCommentSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for paid users
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
  replies : [replySchema]
});

// Create and export the Comment model
module.exports = mongoose.model('PrivateComment', privateCommentSchema);
