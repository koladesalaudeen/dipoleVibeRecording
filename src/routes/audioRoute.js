const express = require('express');
const router = express.Router();
const multer = require('multer');
const transcribeAudio = require('../controllers/audioController').transcribeAudio;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/transcribe', upload.single('audioBlob'), transcribeAudio);

module.exports = router;

// const express = require('express');
// // const router = express.Router();
// const multer = require('multer');
// const transcribeAudio = require('../controllers/audioController').transcribeAudio;
// const audioService = require('../services/audioServices')

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// function createAudioRoute(transcriptionQueue) {
//     const router = express.Router();
  
//     router.post('/submitVideo', upload.single('video'), audioService.handleVideoSubmission(transcriptionQueue));
  
//     return router;
//   }

// router.post('/transcribe', upload.single('audioBlob'), transcribeAudio);
// module.exports = createAudioRoute;