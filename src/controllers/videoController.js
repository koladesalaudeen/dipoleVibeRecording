const videoService = require("../services/videoServices");
const PublicVideo = require("../models/public-video");

const cloudinary = require("cloudinary").v2;

async function uploadVideoAndTranscription(req, res) {
  try {
    const videoBuffer = req.convertedVideo;
    const audioBuffer = req.extractedAudio;

    if (!videoBuffer) {
      return res.status(400).json({ message: "No video data provided." });
    }

    const { title, summary, tag, public, private } = req.body;

    if (public && private) {
      return res.status(400).json({
        message: "Please specify either public or private, not both.",
      });
    }

    let isPublic = true; // Assume public by default
    if (private) {
      isPublic = false;
    }

    const reqBody = {
<<<<<<< HEAD
      tag: tags,
=======
>>>>>>> main
      title: title,
      summary: summary,
      tags: tag,
      isPublic: isPublic,
    };

    const message = await videoService.saveVideoAndTranscription(
      videoBuffer,
      audioBuffer,
      reqBody
    );
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading video." });
  }
}

async function uploadVideo(req, res){
  try {
    const videoBuffer = req.convertedVideo;

    if (!videoBuffer) {
      return res.status(400).json({ message: "No video data provided." });
    }

    const { title, summary, tags, public, private } = req.body;

    if (public && private) {
      return res.status(400).json({
        message: "Please specify either public or private, not both.",
      });
    }

    let isPublic = true; // Assume public by default
    if (private) {
      isPublic = false;
    }

    const reqBody = {
      tag: tags,
      title: title,
      summary: summary,
      tags: tags,
      isPublic: isPublic,
    };

    const message = await videoService.uploadVideoAndSaveUserInfo(
      videoBuffer,
      reqBody
    );
    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading video." });
  }
}

async function fetchAllPublicVideos(req, res) {
  try {
    const { page } = req.query;

    const videoList = await videoService.fetchAllPublicVideos(page);

    return res.status(200).json(videoList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving videos" });
  }
}

async function fetchAllPrivateVideos(req, res) {
  try {
    const { page, userId } = req.query;

    const videoList = await videoService.fetchAllPrivateVideos(page, userId);

    return res.status(200).json(videoList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving videos" });
  }
}

async function viewVideoById(req, res) {
  const { videoId } = req.params;

  try {
    const video = await videoService.fetchVideoById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return res.status(500).json({ message: "Error fetching video" });
  }
}

async function getVideoMetadata(req, res) {
  try {
    const publicUrl = req.query.url;

    const videoMetadata = await videoService.getVideoMetadata(publicUrl);

    return res.status(200).json(videoMetadata);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving video metadata." });
  }
}

// Controller function to delete a video by its public ID
async function deleteVideo(req, res) {
  try {
    const publicId = req.query.publicId;

    const deletionResult = await videoService.deleteVideo(publicId);

    if (deletionResult) {
      return res.status(200).json({ message: "Video deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "Video not found or could not be deleted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting video." });
  }
}

async function searchVideos(req, res) {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Parameter is missing." });
    }

    const videos = await videoService.searchVideos(search);

    if (videos.length === 0) {
      return res.status(404).json({ message: "No videos found." });
    }

    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error searching videos:", error);
    return res.status(500).json({ message: "Error searching videos." });
  }
}

// Search by Date
async function searchVideosByDateAPI(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate are required." });
    }

    const videos = await videoService.searchVideosByDateAPI(startDate, endDate);

    if (videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found for the specified date range." });
    }

    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error searching videos by date:", error);
    return res.status(500).json({ message: "Error searching videos by date." });
  }
}

async function increaseViewCount(req, res) {
  try {
    const { videoId } = req.query;

    const video = await videoService.increaseViewCount(videoId);

    return res.status(200).json({ message: "View count updated successfully" });
  } catch (error) {
    //console.error('Error increasing view count:', error);
    return res.status(500).json({ message: "Error increasing view count" });
  }
}

module.exports = {
  uploadVideo,
  getVideoMetadata,
  deleteVideo,
  searchVideos,
  fetchAllPublicVideos,
  fetchAllPrivateVideos,
  viewVideoById,
  increaseViewCount,
<<<<<<< HEAD
  searchVideosByTitle,
  fetchAllPrivateVideos,
  uploadVideoAndTranscription,
=======
  searchVideosByDateAPI,
>>>>>>> main
};
