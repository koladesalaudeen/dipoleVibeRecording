require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const videoRoutes = require('./src/routes/videoRoute');
const commentRoutes = require('./src/routes/commentRoute');

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

// Use the video routes
app.use('/videos', videoRoutes);
app.use('/comments', commentRoutes);

// Other middleware and configurations

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
