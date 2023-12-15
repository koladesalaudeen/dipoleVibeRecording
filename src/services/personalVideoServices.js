const { uploadVideo } = require('./videoServices');
const { findUsersByEmail } = require('./userServices');
const personalVideoModel = require('../models/personal-video')

async function createVideo(videoBuffer, reqBody){
    try{
        const userId = await findUsersByEmail( reqBody.userEmail );
        const videoURL = await uploadVideo(videoBuffer);
    
        const videoData = {
            userId: userId,
            videoURL: videoURL,
            videoTitle: reqBody.title,
            videoSummary: reqBody.summary
        }
    
        const videoModel = new personalVideoModel(videoData);
        videoModel.save();
    
        return {
            message: 'video uploaded successfully'
        }
    }
    catch(error){
        console.error('Error :', error);
        throw error;
    }
}

async function fetchAllVideosByEmail( userEmail, pageNumber){
    try{
        const page = parseInt(pageNumber, 10) || 5;
        const pageSize = parseInt("10", 10) || 20;

        const videoList = await personalVideoModel.aggregate([
            {
              $facet: {
                metadata: [{ $count: "totalCount" }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
              },
            },
          ]);
        // const videos = await personalVideoModel.find({ userEmail });
        const response = {
            success: true,
            videos: {
              metadata: {
                totalCount: videoList[0].metadata[0].totalCount,
                page,
                pageSize,
              }
            },
            data: videoList
          }

        return response;
    }
    catch(error){
        console.error('Error :', error);
        throw error;
    }
}

async function searchVideosByDateAPI(startDate, endDate) {
    try {
      const formattedStartDate = moment(startDate, "YYYY-MM-DD").toISOString();
      const formattedEndDate = moment(endDate, "YYYY-MM-DD")
        .add(1, "day")
        .toISOString();
      const videos = await personalVideoModel.find({
        createdAt: {
          $gte: formattedStartDate,
          $lt: formattedEndDate,
        },
      });
  
      return videos;
    } catch (error) {
      throw new Error("Error searching videos by date.");
    }
}

async function deleteVideo(videoId) {
    try {
      const cloudinaryResult = await cloudinary.uploader.destroy(videoId);
  
      if (cloudinaryResult.result === 'ok') {
        const dbResult = await personalVideoModel.deleteOne({ videoURL: videoId });
  
        if (dbResult.deletedCount === 1) {
          return "video deleted successfully"; 
        } else {
          throw new Error('Failed to delete the video record from the database');
        }
      } else {
        throw new Error('Failed to delete the video from Cloudinary');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

module.exports = {
    createVideo,
    fetchAllVideosByEmail,
    searchVideosByDateAPI,
    deleteVideo,
};