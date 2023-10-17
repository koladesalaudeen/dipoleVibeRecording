const fs = require('fs');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const createReadStream = fs.createReadStream;
const OpenAI = require('openai');
const PublicVideo = require('../models/public-video')
const cloudinary =require('cloudinary').v2; 
const { CloudinaryStorage } =require('multer-storage-cloudinary');
//const { io } = require('../../index');


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});


const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'samples', 
    allowed_formats: ['mp4', 'avi', 'mkv', 'jpeg'], 
  },
});

const OpenAIAPIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OpenAIAPIKey
});


async function uploadVideo( videoBuffer ) {
  try {
    const {secure_url}  = await cloudinary.uploader.upload(`data:video/mp4;base64,${videoBuffer.toString('base64')}`, {
      resource_type: 'video',
    });

    return secure_url;

  } catch (error) {
    throw new Error('Error uploading video to Cloudinary: ' + error.message );
  }
}

async function transcribeAudio (audioBuffer){
  try {
    const tempFilePath = 'audio.m4a';

    await writeFileAsync(tempFilePath, audioBuffer);

    const audioStream = createReadStream(tempFilePath);

    transcriptionResult = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
    });

    fs.unlinkSync(tempFilePath);
    return transcriptionResult.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

async function saveVideoAndTranscription(videoBuffer, audioBuffer, reqBody) {
  try {
      const audioTranscription = await transcribeAudio(audioBuffer);
      const videoUrl = await uploadVideo(videoBuffer);

      const videoData = {
          videoTitle: reqBody.title,
          videoSummary: reqBody.summary,
          tags: reqBody.tags,
          videoURL: videoUrl,
          transcription: audioTranscription
      };

      const VideoModel = reqBody.isPublic ? PublicVideo : PrivateVideo;

      const video = new VideoModel(videoData);
      await video.save();

      return {
          message: "Video upload and transcription successful",
          videoObj: videoData
      };
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}


async function getVideoMetadata(publicUrl) {
  try {
    const video = await cloudinary.api.resource(publicUrl);

    // Return video metadata
    return video;
  } catch (error) {
    throw new Error('Error retrieving video metadata from Cloudinary: ' + error.message);
  }
}

async function deleteVideo(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    // Return deletion result
    return result.result === 'ok';
  } catch (error) {
    throw new Error('Error deleting video from Cloudinary: ' + error.message);
  }
}

async function fetchVideoById(videoId){
  try {
    const video = await PublicVideo.findOne({ videoId });

    return video;
  } catch (error) {
    throw new Error('Error fetching video by videoId');
  }
}

async function fetchAllPublicVideos(pageNumber){
  try {
      const page = parseInt(pageNumber, 10) || 5;
      const pageSize = parseInt("10", 10) || 20;

      const videoList = await PublicVideo.aggregate([
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          },
        },
      ]);

      const response = {
        success: true,
        videos: {
          metadata: { totalCount: videoList[0].metadata[0].totalCount, page, pageSize },
          data: videoList[0].data,
        },
      };

    return response;
  } catch (error) {
    throw new Error('Error retrieving videos');
  }
}

async function searchVideosByDate(query) {
  try {
    // Parse the query date string into a JavaScript Date object
    const date = new Date(query);

    if (isNaN(date.getTime())) {
      return []; // Invalid date format, return an empty array
    }

    // Search for videos uploaded on the specified date
    const videos = await PublicVideo.find({
      uploadedAt: {
        $gte: date, // Greater than or equal to the specified date
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Less than the next day
      },
    });
    return videos;
  } catch (error) {
    console.error("Error searching videos by date:", error);
    throw error; // You can throw the error to handle it in the caller function
  }
}

async function increaseViewCount(videoId) {
  try {
    // Find the video by its ID and update the view count
    const video = await PublicVideo.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    video.views += 1;
    await video.save();

    // Emit a real-time update to all users with the new view count
    io.emit('updateViewCount', { videoId, views: video.views });
  } catch (error) {
    console.error('Error increasing view count:', error);
    throw error;
  }
}

module.exports = {
  getVideoMetadata,
  deleteVideo,
  fetchAllPublicVideos,
  fetchVideoById,
  saveVideoAndTranscription,
  searchVideosByDate,
  increaseViewCount,
  cloudinaryStorage
};
