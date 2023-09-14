
const commentService = require('../services/commentServices');

async function createComment(req, res) {
  try {
    const { text, author, videoId } = req.body;

    if (!text || !author || !videoId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const comment = await commentService.createComment(text, author, videoId);
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating comment.' });
  }
}

async function getCommentsByVideo(req, res) {
  try {
    const videoId = req.params.videoId;

    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required.' });
    }

    const comments = await commentService.getCommentsByVideo(videoId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching comments.' });
  }
}

// Add more comment-related controller functions as needed

module.exports = {
  createComment,
  getCommentsByVideo,
};
