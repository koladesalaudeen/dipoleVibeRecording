const personalVideoServices = require('../services/personalVideoServices')

async function createVideo( req, res){
    try{
        const videoBuffer = req.file.buffer;

        if (!videoBuffer) {
            return res.status(400).json({ message: "No video data provided." });
        }

        const { userEmail, title, summary } = req.body;

        const reqBody = {
            title: title,
            summary: summary,
            userEmail: userEmail
        };

        const message = await personalVideoServices.createVideo(
            videoBuffer,
            // audioBuffer,
            reqBody
        );

        res.status(200).json( { message: message} );
    }
    catch(error){
        console.error('Error :', error);
        return res.status(500).json({ message: "Error uploading video." });
    }
}

async function fetchAllVideosByEmail( req, res){
    try{
        const { userEmail, pageNum} = req.query

        const videoList = personalVideoServices.fetchAllVideosByEmail( userEmail, pageNum );

        res.status(200).json(videoList);
    }
    catch(error){
        console.error('Error :', error);
        return res.status(500).json({ message: "Error retrieving videos" });
    }
}

async function searchVideosByDateAPI( req, res) {
    try {
        const { startDate, endDate } = req.query;

        const videoList = personalVideoServices.searchVideosByDateAPI( startDate, endDate )

        res.status(200).json(videoList)
     } catch (error) {
      console.error('Error :', error);
      res.status(500).json({message: "Error searching videos by date."});
    }
}

async function deleteVideo( req, res) {
    try {
        const { videoId } = req.params;

        const response = personalVideoServices.deleteVideo(videoId);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "operation unsuccessful"})
    }
}

module.exports = {
    createVideo,
    fetchAllVideosByEmail,
    searchVideosByDateAPI,
    deleteVideo,
};