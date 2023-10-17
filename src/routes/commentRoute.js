// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const getPrivateComment = require('../controllers/privateCommentController').getPrivateComment;
const postPrivateComment = require('../controllers/privateCommentController').privateCreateComment;
const updatePrivateComment = require('../controllers/privateCommentController').updatePrivateComment;
const deletePrivateComment = require('../controllers/privateCommentController').deletePrivateComment;
const getPublicComment = require('../controllers/publicCommentController').getPublicComment;
const postPublicComment = require('../controllers/publicCommentController').publicCreateComment;
const updatePublicComment = require('../controllers/publicCommentController').updatePublicComment;
const deletePublicComment = require('../controllers/publicCommentController').deletePublicComment;
const createReply = require('../controllers/replyController').createReply;
// Create a comment

// Get comments for a specific private video
router.get('/private-video/:videoId', getPrivateComment);

// Create Comments for private videos
router.post('/private-video/:videoId', postPrivateComment);

// Get public comments
router.get('/public-video/:videoId', getPublicComment);

// Create Comments for private videos
router.post('/public-video/:videoId', postPublicComment);

// Update public comment
router.put('/update-public-comment/:commentId', updatePublicComment)

// delete public comment 
router.delete('/delete-public-comment/:commentId', deletePublicComment)

// update private comment
router.put('/update-private-comment', updatePrivateComment)

// delete private comment
router.delete('/delete-private-comment', deletePrivateComment)

// reply routes
router.post('/reply', createReply);

module.exports = router;
