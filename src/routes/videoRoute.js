const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  ffmpegConversionMiddleware,
  extractAndUploadAudio,
} = require("../middleware/ffmpeg");
const {
  getRecommendedVideos,
} = require("../controllers/recommendationController");
const uploadVideo = require("../controllers/videoController").uploadVideo;
const getVideoMetadata =
  require("../controllers/videoController").getVideoMetadata;
const deleteVideo = require("../controllers/videoController").deleteVideo;
const viewVideoById = require("../controllers/videoController").viewVideoById;
const fetchAllPublicVideos =
  require("../controllers/videoController").fetchAllPublicVideos;
const fetchAllPrivateVideos =
  require("../controllers/videoController").fetchAllPrivateVideos;
const searchVideosByTitle =
  require("../controllers/videoController").searchVideosByTitle;
const increaseViewCount =
  require("../controllers/videoController").increaseViewCount;
const cloudinaryStorage =
  require("../services/videoServices").cloudinaryStorage;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up Multer to handle video file uploads
// const upload = multer({ storage: cloudinaryStorage,
//                         limits: { fileSize: 10000000 } });

// Define routes
router.post(
  "/upload",
  upload.single("video"),
  ffmpegConversionMiddleware,
  extractAndUploadAudio,
  uploadVideo
);
router.post("/updateViewCount", increaseViewCount);
router.get("/metadata", getVideoMetadata);
router.get("/fetch/public", fetchAllPublicVideos);
router.get("/fetch/private", fetchAllPrivateVideos);
router.get("/view/:videoId", viewVideoById);
router.get("/search", searchVideosByTitle);
router.delete("/delete", deleteVideo);

module.exports = router;
router.get("/recommended", getRecommendedVideos);

module.exports = router;

// module.exports = (io) => {
//     // Set up Multer to handle video file uploads
//     const storage = multer.memoryStorage();
//     const upload = multer({ storage: storage });

//     // Define routes
//     router.post('/upload', upload.single('video'), ffmpegConversionMiddleware, extractAndUploadAudio, uploadVideo);
//     router.post('/updateViewCount/:videoId', (req, res) => increaseViewCount(io, req, res)); // Pass videoId as a route parameter
//     router.get('/metadata', getVideoMetadata);
//     router.get('/fetch/public', fetchAllPublicVideos);
//     router.get('/view/:videoId', (req, res) => viewVideoById(io, req, res)); // Pass videoId as a route parameter
//     router.get('/search', searchVideosByDate);
//     router.delete('/delete', deleteVideo);

//     return router;
//   };
