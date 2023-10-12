const User = require('../models/user');
const PrivateVideo = require('../models/private-video')
const PrivateComment = require('../models/privateComment')

async function privateCreateComment(req, res) {
    try {
      const { text, email } = req.body;
      const { videoId } = req.params;
  
      if (!text || !videoId) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }

     // Check if the videoId exists in the privateVideo model
    const videoExists = await PrivateVideo.exists({ _id: videoId });
  
    if (!videoExists) {
        return res.status(404).json({ error: 'Private video not found.' });
    }
  
      let user;
  
      if (email) {
        user = await User.findOne({ email });
      } else {
        return res.status(404).json({ error: "User not found." });
      }
  
      const author = user.name || user._id;
      const authorPaid = user.isPaidUser;
      const userId = user._id;
  
      const newComment = new PrivateComment({
        userId,
        text,
        author,
        authorPaid,
        publicVideo: videoId,
        timestamp: new Date(),
      });
  
      const savedComment = await newComment.save();
  
      const publicVideo = await PrivateVideo.findOneAndUpdate(
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
  
  async function getPrivateComment(req, res) {
    try {
      const { videoId } = req.params;
  
      // Check if the videoId exists in the privateVideo model
      const videoExists = await PrivateVideo.exists({ _id: videoId });
  
      if (!videoExists) {
        return res.status(404).json({ error: 'Private video not found.' });
      }
  
      // Find comments associated with the private video
      const comments = await PrivateComment.find({ privateVideo: videoId })
        .populate('userId') // Populate the userId field with user details
        .sort({
          authorPaid: -1, // Prioritize paid users first
          timestamp: 1, // Sort by timestamp in ascending order
        })
        .exec();
  
      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching private comments.' });
    }
  }
  
  module.exports = { getPrivateComment };
  

module.exports = { getPrivateComment, privateCreateComment };
