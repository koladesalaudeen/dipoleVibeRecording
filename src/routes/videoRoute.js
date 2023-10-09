const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpegConversionMiddleware = require('../middleware/ffmpeg');
const uploadVideo = require('../controllers/videoController').uploadVideo;
const getVideoMetadata = require('../controllers/videoController').getVideoMetadata;
const deleteVideo = require('../controllers/videoController').deleteVideo;
const viewVideoById = require('../controllers/videoController').viewVideoById;
const fetchAllPublicVideos = require('../controllers/videoController').fetchAllPublicVideos;
const cloudinaryStorage = require('../services/videoServices').cloudinaryStorage;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Set up Multer to handle video file uploads
// const upload = multer({ storage: cloudinaryStorage,
//                         limits: { fileSize: 10000000 } });

// Define routes
router.post('/upload', upload.single('video'), ffmpegConversionMiddleware, uploadVideo);
router.get('/metadata', getVideoMetadata);
router.get('/fetch/public', fetchAllPublicVideos);
router.get('/view/:videoId', viewVideoById);
router.delete('/delete', deleteVideo);

module.exports = router;
