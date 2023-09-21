const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadVideo = require('../controllers/videoController').uploadVideo;
const getVideoMetadata = require('../controllers/videoController').getVideoMetadata;
const deleteVideo = require('../controllers/videoController').deleteVideo;
const cloudinaryStorage = require('../services/videoServices').cloudinaryStorage;


// Set up Multer to handle video file uploads
const upload = multer({ storage: cloudinaryStorage,
                        limits: { fileSize: 10000000 } });

// Define routes
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/metadata', getVideoMetadata);
router.delete('/delete', deleteVideo);

module.exports = router;
