const PublicComment = require('../models/publicComments');
const PrivateComment = require('../models/privateComment');
const generateRandomName = require('../utils/generateName').generateRandomName

async function createReply(req, res) {
    try {
      const { text } = req.body;
      const {commentId} = req.params
  
      if (!text || !commentId) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
  
      // Check if commentId belongs to a public or private comment
      const isPublicComment = await PublicComment.exists({ _id: commentId });
      const isPrivateComment = await PrivateComment.exists({ _id: commentId });

      let user;

      if (isPublicComment || isPrivateComment) {
        const user = isPublicComment? isPublicComment.userId : isPrivateComment.userId;
      }
  
      if (!isPublicComment && !isPrivateComment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }

      const author = user ? (user.name || user._id) : generateRandomName();
      const authorPaid = user ? user.isPaidUser : false;
      const userId = user ? user._id : null;
  
      const reply = {
        text,
        author,
        userId,
        authorPaid,
      };
  
      let updatedComment;
  
      if (isPublicComment) {
        updatedComment = await PublicComment.findByIdAndUpdate(
          commentId,
          { $push: { replies: reply } },
          { new: true }
        );
      } else {
        updatedComment = await PrivateComment.findByIdAndUpdate(
          commentId,
          { $push: { replies: reply } },
          { new: true }
        );
      }
  
      return res.status(201).json(updatedComment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating reply.' });
    }
  }


  module.exports = {
    createReply
  }