// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const {Storage} = require('@google-cloud/storage');

// const app = express();
// app.use(express.json( { limit: '25mb'} ));
// app.use(express.urlencoded({ limit: '25mb'}));
// const cors = require('cors');

// const storage = new Storage();

// const videoRoutes = require('./src/routes/videoRoute');
// const commentRoutes = require('./src/routes/commentRoute');
// const userRoute= require('./src/routes/userRoute')
// const audioRoute = require('./src/routes/audioRoute');

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error.message);
// });

// const cache = new Map();

// async function checkBucketExistence(bucketName) {
//   if (cache.has(bucketName)) {
//     return cache.get(bucketName);
//   }

//   try {
//     await storage.bucket(bucketName).get();
//     cache.set(bucketName, true); 
//     return true;
//   } catch (error) {
//     if (error.code === 404) {
//       cache.set(bucketName, false); 
//       return false;
//     }
//     throw error; 
//   }
// }

// async function createBucketIfNotExist() {
//   const bucketName = 'dipole-vibe-recordings';

//   const bucketExists = await checkBucketExistence(bucketName);

//   if (!bucketExists) {
//     try {
//       await storage.createBucket(bucketName);
//       console.log('Bucket "dipole-vibe-recordings" created.');
//     } catch (error) {
//       console.error(`Error creating bucket: ${error.message}`);
//     }
//   }
// }

// createBucketIfNotExist();

// app.use(cors());
// // Use the video routes
// app.use('/videos', videoRoutes);
// app.use('/audio', audioRoute);
// app.use('/comments', commentRoutes);
// app.use('/user', userRoute)


// const server = app.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });

// module.exports = storage;
require('dotenv').config();
const express = require('express');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');

const app = express();
const server = http.createServer(app); // Create an HTTP server using app
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const io = socketIo(server);

const storage = new Storage();

const videoRoutes = require('./src/routes/videoRoute');
const commentRoutes = require('./src/routes/commentRoute');
const userRoute= require('./src/routes/userRoute')
const audioRoute = require('./src/routes/audioRoute');
const audioService = require('./src/services/audioServices');
const replyRoute = require('./src/routes/replyRoute');

//const transcriptionQueue = audioService.initializeQueue();
// app.use('/audio', audioRoute(transcriptionQueue));


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});



app.use(cors());
// Use the video routes
app.use('/videos', videoRoutes);
app.use('/audio', audioRoute);
app.use('/comments', commentRoutes);
app.use('/user', userRoute)
app.use('/reply', replyRoute)

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for updates from clients
  socket.on('updateViewCount', ({ cardId, views }) => {
    // Broadcast the update to all connected clients
    io.emit('updateViewCount', { cardId, views });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


server.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = {
  storage,
  io,
};