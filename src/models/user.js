const mongoose = require('mongoose');

// Define the Comment schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  videoPrivate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateVideo',
    },
  ],
  videoPublic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicVideo',
    }
  ],
  shared: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shared', 
  },  
  isPaidUser: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
module.exports = mongoose.model('User', UserSchema);
