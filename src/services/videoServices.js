const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const createReadStream = fs.createReadStream;
const OpenAI = require("openai");
const PublicVideo = require("../models/public-video");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const PrivateVideo = require("../models/private-video");
const moment = require("moment");
const PublicComment = require("../models/privateComment");
//const { io } = require('../../index');

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY,   
  api_secret:process.env.CLOUDINARY_API_SECRET, 
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "samples",
    allowed_formats: ["mp4", "avi", "mkv", "jpeg", "mov"],
  },
});

const OpenAIAPIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OpenAIAPIKey,
});

async function uploadVideo(videoBuffer) {
  try {
    const { secure_url } = await cloudinary.uploader.upload(
      `data:video/mp4;base64,${videoBuffer.toString("base64")}`,
      {
        resource_type: "video",
      }
    );

    return secure_url;
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    // throw new Error("Error uploading video to Cloudinary: " + JSON.stringify(error));
  }
}

async function transcribeAudio(audioBuffer) {
  try {
    const tempFilePath = "audio.m4a";

    await writeFileAsync(tempFilePath, audioBuffer);

    const audioStream = createReadStream(tempFilePath);

    transcriptionResult = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
    });

    fs.unlinkSync(tempFilePath);
    console.log( transcriptionResult.text )
    return transcriptionResult.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);

    throw error;
  }
}

async function saveVideoAndTranscription(videoBuffer, reqBody) {
  try {
    // const audioTranscription = await transcribeAudio(videoBuffer);
    const videoUrl = await uploadVideo(videoBuffer);

    const videoData = {
      videoTitle: reqBody.title,
      videoSummary: reqBody.summary,
      tags: reqBody.tags,
      videoURL: videoUrl,
      // transcription: audioTranscription,
    };

    const VideoModel = reqBody.isPublic ? PublicVideo : PrivateVideo;

    const video = new VideoModel(videoData);
    await video.save();

    return {
      message: "Video upload and transcription successful",
      videoData: video,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getVideoMetadata(publicUrl) {
  try {
    const video = await cloudinary.api.resource(publicUrl);

    // Return video metadata
    return video;
  } catch (error) {
    throw new Error(
      "Error retrieving video metadata from Cloudinary: " + error.message
    );
  }
}

async function deleteVideo(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    // Return deletion result
    return result.result === "ok";
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchVideoById(videoId) {
  try {
    const video = await PublicVideo.findById({ _id: videoId });

    return video;
  } catch (error) {
    throw new Error("Error fetching video by videoId");
  }
}

async function fetchAllPublicVideos(pageNumber) {
  try {
    const page = parseInt(pageNumber, 10) || 5;
    const pageSize = parseInt("10", 10) || 20;

    const videoList = await PublicVideo.aggregate([
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    const videos = await PublicVideo.populate(videoList[0].data, {
      path: "comment",
      populate: { path: "replies" },
    });

    const response = {
      success: true,
      videos: {
        metadata: {
          totalCount: videoList[0].metadata[0].totalCount,
          page,
          pageSize,
        },
        data: videos,
      },
    };

    return response;
  } catch (error) {
    throw new Error("Error retrieving videos");
  }
}

async function fetchAllPrivateVideos(pageNumber, userId) {
  try {
    const page = parseInt(pageNumber, 10) || 1;
    const pageSize = parseInt("10", 10) || 6;

    const videoList = await PrivateVideo.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    const response = {
      success: true,
      videos: {
        metadata: {
          totalCount: videoList[0].metadata[0].totalCount,
          page,
          pageSize,
        },
        data: videoList[0].data,
      },
    };

    return response;
  } catch (error) {
    throw new Error("Error retrieving videos");
  }
}

async function searchVideos(search) {
  try {
    // Search for videos with titles matching the title query
    const videos = await PublicVideo.find({
      $or: [
        { videoTitle: { $regex: search, $options: "i" } },
        { tags: { $in: [search] } },
        { videoSummary: { $regex: search, $options: "i" } },
      ],
    }).populate("comment");

    return videos;
  } catch (error) {
    throw new Error("Error searching videos.");
  }
}

// Search by Date
async function searchVideosByDateAPI(startDate, endDate) {
  try {
    const formattedStartDate = moment(startDate, "YYYY-MM-DD").toISOString();
    const formattedEndDate = moment(endDate, "YYYY-MM-DD")
      .add(1, "day")
      .toISOString();
    const videos = await PublicVideo.find({
      createdAt: {
        $gte: formattedStartDate,
        $lt: formattedEndDate,
      },
    }).populate("comment");

    return videos;
  } catch (error) {
    throw new Error("Error searching videos by date.");
  }
}

async function increaseViewCount(videoId) {
  try {
    // Find the video by its ID and update the view count
    const video = await PublicVideo.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    video.views += 1;
    await video.save();
  } catch (error) {
    console.error("Error increasing view count:", error);

    throw error;
  }
}

module.exports = {
  uploadVideo,
  getVideoMetadata,
  deleteVideo,
  fetchAllPublicVideos,
  fetchVideoById,
  saveVideoAndTranscription,
  searchVideos,
  increaseViewCount,
  cloudinaryStorage,
  fetchAllPrivateVideos,
  searchVideosByDateAPI,
};
