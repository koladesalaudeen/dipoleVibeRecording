// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a comment
router.post('/', commentController.createComment);

// Get comments for a specific video
router.get('/video/:videoId', commentController.getCommentsByVideo);

// Add more comment-related routes as needed

module.exports = router;
