


// async function createComment(text, author, videoId) {
//   try {
//     const comment = new Comment({
//       text,
//       author,
//       video: videoId,
//     });
//     await comment.save();
//     return comment;
//   } catch (error) {
//     throw new Error('Error creating comment: ' + error.message);
//   }
// }

// async function getCommentsByVideo(videoId) {
//   try {
//     const comments = await Comment.find({ video: videoId });
//     return comments;
//   } catch (error) {
//     throw new Error('Error fetching comments: ' + error.message);
//   }
// }

// // Add more comment-related functions as needed

// module.exports = {
//   createComment,
//   getCommentsByVideo,
// };
