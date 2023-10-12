const User = require('../models/user');
const PublicVideo = require('../models/public-video')
const generateRandomName = require('../utils/generateName').generateRandomName;
const PublicComment = require('../models/publicComments')

async function publicCreateComment(req, res) {
    try {
      const { text, email } = req.body;
      const { videoId } = req.params;
  
      if (!text || !videoId) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

      const videoExists = await PublicVideo.exists({ _id: videoId });
  
      if (!videoExists) {
          return res.status(404).json({ error: 'Private video not found.' });
      }
  
      let user;
  
      if (email) {
        user = await User.findOne({ email });
  
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }
      }
  
      const author = user ? (user.name || user._id) : generateRandomName();
      const authorPaid = user ? user.isPaidUser : false;
      const userId = user ? user._id : null;
  
      const newComment = new PublicComment({
        userId,
        text,
        author,
        authorPaid,
        publicVideo: videoId,
        timestamp: new Date(),
      });
  
      const savedComment = await newComment.save();
  
      const publicVideo = await PublicVideo.findOneAndUpdate(
        { _id: videoId },
        { $push: { comments: savedComment._id } },
        { new: true }
      );
  
      return res.status(201).json({ savedComment, publicVideo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating comment.' });
    }
  }
  
  
  
  
  async function getPublicComment(req, res) {
    try {
      const { videoId } = req.params;

      const videoExists = await PublicVideo.exists({ _id: videoId });
  
      if (!videoExists) {
          return res.status(404).json({ error: 'Private video not found.' });
      }
  
      // Find comments associated with the public video
      const comments = await PublicComment.find({ publicVideo: videoId })
        .populate('userId') // Populate the userId field with user details
        .sort({
          authorPaid: -1, // Prioritize paid users first
          timestamp: 1, // Sort by timestamp in ascending order
        })
        .exec();
  
      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching public comments.' });
    }
  }

module.exports = { getPublicComment, publicCreateComment };
