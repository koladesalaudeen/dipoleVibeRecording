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
        type: [String], 
    },
});

module.exports = mongoose.model('PublicVideo', publicVideoSchema);
