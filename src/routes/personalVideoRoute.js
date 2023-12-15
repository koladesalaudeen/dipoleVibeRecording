const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    createVideo,
    fetchAllVideosByEmail,
    searchVideosByDateAPI,
    deleteVideo,
} = require("../controllers/personalVideoController")

const storage= multer.memoryStorage();
const upload= multer({ storage: storage});

router.post(
    "/upload",
    upload.single("video"),
    createVideo
)
router.get("/search-by-mail", fetchAllVideosByEmail);
router.get("/search-by-date", searchVideosByDateAPI);
router.delete("/:videoId", deleteVideo);