
const commentService = require('../services/commentServices');
const User = require('../models/user');

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


async function createComment(req, res) {
  try {
    const { text, email } = req.body;
    const {videoId} = req.params;

    if (!text || !email) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const user = await User.findById(email);

    const newComment = new Comment({
      text,
      author: user.isPaidUser ? null : generateRandomLetters(),
      authorPaid: user.isPaidUser ? user._id : null,
      privateVideo: videoId,
      publicVideo: null, // Assuming it's null for private videos
      timestamp: new Date(),
    });

    const savedComment = await newComment.save();

    const privateVideo = await PrivateVideo.findOneAndUpdate(
      { _id: videoId },
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating comment.' });
  }
}


// getAllComment

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
