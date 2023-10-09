const PublicVideo = require('../models/public-video')
const cloudinary =require('cloudinary').v2; 
const { CloudinaryStorage } =require('multer-storage-cloudinary');


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


async function uploadVideo( videoBuffer, reqBody ) {
  try {
    const { secure_url } = await cloudinary.uploader.upload(`data:video/mp4;base64,${videoBuffer.toString('base64')}`, {
      resource_type: 'video',
    });

    const video = new PublicVideo({ 
      videoTitle: reqBody.title,
      videoSummary: reqBody.summary,
      videoURL: secure_url 
    });
    await video.save();

    return secure_url;
  } catch (error) {
    throw new Error('Error uploading video to Cloudinary: ' + error.message );
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
    // const videoList = await PublicVideo.find();
      console.log(pageNumber);
      const page = parseInt("1", 10) || 5;
      const pageSize = parseInt("10", 10) || 20;
      console.log(pageSize);

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

module.exports = {
  uploadVideo,
  getVideoMetadata,
  deleteVideo,
  fetchAllPublicVideos,
  fetchVideoById,
  cloudinaryStorage
};
