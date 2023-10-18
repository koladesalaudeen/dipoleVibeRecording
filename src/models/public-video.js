const mongoose = require('mongoose');

const publicVideoSchema = new mongoose.Schema({
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
    tags: {
        type: [String], // Array of strings
        validate: {
            validator: function(tags) {
                return tags.length >= 1 && tags.length <= 3; // Allow 1 to 3 tags
            },
            message: 'You can add between 1 and 3 tags.'
        }
    },
});

module.exports = mongoose.model('PublicVideo', publicVideoSchema);
