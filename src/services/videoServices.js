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


async function uploadVideo(base64String) {
  try {
    const { secure_url } = await cloudinary.uploader.upload(`data:video/mp4;base64,${base64String}`, {
      resource_type: 'video',
    });
    return secure_url;
  } catch (error) {
    throw new Error('Error uploading video to Cloudinary: ' + error.message);
  }
}

// Function to retrieve video metadata from Cloudinary by its public URL
async function getVideoMetadata(publicUrl) {
  try {
    const video = await cloudinary.api.resource(publicUrl);

    // Return video metadata
    return video;
  } catch (error) {
    throw new Error('Error retrieving video metadata from Cloudinary: ' + error.message);
  }
}

// Function to delete a video from Cloudinary by its public ID
async function deleteVideo(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    // Return deletion result
    return result.result === 'ok';
  } catch (error) {
    throw new Error('Error deleting video from Cloudinary: ' + error.message);
  }
}

module.exports = {
  uploadVideo,
  getVideoMetadata,
  deleteVideo,
  cloudinaryStorage
};
