const express = require('express');
const router = express.Router();
const multer = require('multer');
const videoController = require('../controllers/videoController');
const videoService = require('../services/videoServices')

// Set up Multer to handle video file uploads
const upload = multer({ storage: videoService.cloudinaryStorage });

// Define routes
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/metadata', videoController.getVideoMetadata);
router.delete('/delete', videoController.deleteVideo);

module.exports = router;
