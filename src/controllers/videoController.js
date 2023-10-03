const videoService = require('../services/videoServices');

const cloudinary = require('cloudinary').v2;

async function uploadVideo(req, res) {
  try {
    const videoBuffer = req.file.buffer;

    if (!videoBuffer) {
      return res.status(400).json({ message: 'No video data provided.' });
    }
    const videoUrl = await videoService.uploadVideo();

    return res.status(201).json({ videoUrl: videoUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error uploading video.' });
  }
}

async function fetchAllPublicVideos(req, res){
  try{
    const videoList = await videoService.fetchAllPublicVideos();

    return res.status(200).json(videoList);
  }
  catch(error){
    return res.status(500).json({ message: 'Error retrieving videos'})
  }
}

async function viewVideoById(req, res){
  const { videoId } = req.params;

  try {
    const video = await videoService.fetchVideoById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return res.status(500).json({ message: 'Error fetching video' });
  }
}
// Controller function to upload a video
// async function uploadVideo(req, res) {
//   try {
//     const videoBuffer = req.file.buffer;
//     console.log(video)
//     // if (!videoBuffer) {
//     //   return res.status(400).json({ message: 'No video file uploaded.' });
//     // }

//     const videoUrl = await videoService.uploadVideo(videoBuffer);

//     return res.status(201).json({ videoUrl });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error uploading video.' });
//   }
// }

// Controller function to retrieve video metadata by public URL

async function getVideoMetadata(req, res) {
  try {
    const publicUrl = req.query.url;

    const videoMetadata = await videoService.getVideoMetadata(publicUrl);

    return res.status(200).json(videoMetadata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving video metadata.' });
  }
}

// Controller function to delete a video by its public ID
async function deleteVideo(req, res) {
  try {
    const publicId = req.query.publicId;

    const deletionResult = await videoService.deleteVideo(publicId);

    if (deletionResult) {
      return res.status(200).json({ message: 'Video deleted successfully.' });
    } else {
      return res.status(404).json({ message: 'Video not found or could not be deleted.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting video.' });
  }
}

module.exports = {
  uploadVideo,
  getVideoMetadata,
  deleteVideo,
  fetchAllPublicVideos,
  viewVideoById
};
