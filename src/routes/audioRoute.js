const express = require('express');
const router = express.Router();
const multer = require('multer');
const transcribeAudio = require('../controllers/audioController').transcribeAudio;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/transcribe', upload.single('audioBlob'), transcribeAudio);

module.exports = router;