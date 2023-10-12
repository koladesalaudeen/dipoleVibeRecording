// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const getPrivateComment = require('../controllers/privateCommentController').getPrivateComment;
const postPrivateComment = require('../controllers/privateCommentController').privateCreateComment;
const getPublicComment = require('../controllers/publicCommentController').getPublicComment;
const postPublicComment = require('../controllers/publicCommentController').publicCreateComment;
// Create a comment

// Get comments for a specific private video
router.get('/private-video/:videoId', getPrivateComment);

// Create Comments for private videos
router.post('/private-video/:videoId', postPrivateComment);

// Get public comments
router.get('/public-video/:videoId', getPublicComment);

// Create Comments for private videos
router.post('/public-video/:videoId', postPublicComment);

module.exports = router;
