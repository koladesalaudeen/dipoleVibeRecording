require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Storage} = require('@google-cloud/storage');

const app = express();
app.use(express.json( { limit: '25mb'} ));
app.use(express.urlencoded({ limit: '25mb'}));

const storage = new Storage();

const videoRoutes = require('./src/routes/videoRoute');
const commentRoutes = require('./src/routes/commentRoute');
const userRoute= require('./src/routes/userRoute')

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

const cache = new Map();

async function checkBucketExistence(bucketName) {
  if (cache.has(bucketName)) {
    return cache.get(bucketName);
  }

  try {
    await storage.bucket(bucketName).get();
    cache.set(bucketName, true); 
    return true;
  } catch (error) {
    if (error.code === 404) {
      cache.set(bucketName, false); 
      return false;
    }
    throw error; 
  }
}

async function createBucketIfNotExist() {
  const bucketName = 'dipole-vibe-recordings';

  const bucketExists = await checkBucketExistence(bucketName);

  if (!bucketExists) {
    try {
      await storage.createBucket(bucketName);
      console.log('Bucket "dipole-vibe-recordings" created.');
    } catch (error) {
      console.error(`Error creating bucket: ${error.message}`);
    }
  }
}

createBucketIfNotExist();

// Use the video routes
app.use('/videos', videoRoutes);
app.use('/comments', commentRoutes);
app.use('/user', userRoute)


const server = app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = storage;
