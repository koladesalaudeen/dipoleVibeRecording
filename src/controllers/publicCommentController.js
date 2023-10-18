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
          return res.status(404).json({ error: 'Public video not found.' });
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

  async function updatePublicComment(req, res) {
    try {
        const { commentId } = req.params;
        const { text, email } = req.body;

        if (!text || !commentId) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const comment = await PublicComment.findById({_id: commentId});

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        let user;

        if (email) {
            user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            console.log(user)

            if (!user.isPaidUser) {
                return res.status(403).json({ error: "You are not a paid user. Cannot update comment." });
            }
            
        }

        if (user && comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You are not the author of this comment. Cannot update." });
        }

        comment.text = text;

        const updatedComment = await comment.save();

        return res.status(200).json(updatedComment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating comment.' });
    }
}

async function deletePublicComment(req, res) {
    try {
        const { commentId } = req.params;
        const { email } = req.body;

        const comment = await PublicComment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        let user;

        if (email) {
            user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            if (!user.isPaidUser) {
                return res.status(403).json({ error: "You are not a paid user. Cannot delete comment." });
            }
        }

        if (user && comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You are not the author of this comment. Cannot delete." });
        }

        await comment.remove();

        return res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting comment.' });
    }
}


module.exports = { getPublicComment, publicCreateComment, updatePublicComment, deletePublicComment };
