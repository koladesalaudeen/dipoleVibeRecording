const cloudinary = require('cloudinary').v2; // Use the Cloudinary SDK
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // If you're using file uploads

// Configure Cloudinary with your credentials (load from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// If you're handling file uploads, set up a Cloudinary storage engine with Multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Specify the folder in Cloudinary where uploads will be stored
    allowed_formats: ['mp4', 'avi', 'mkv'], // Specify allowed file formats
  },
});

// Function to upload a video to Cloudinary
async function uploadVideo(file) {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
    });

    // Return the public URL of the uploaded video
    return result.secure_url;
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
};
