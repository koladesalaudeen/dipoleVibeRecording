const PublicVideo = require('../models/public-video');
const PrivateVideo = require('../models/private-video');

async function getRecommendedVideos(tags, isPublic) {
    try {
        let videos;
        

        if (isPublic) {
            videos = await PublicVideo.find({ tags: { $in: tags } });
        } else {
            videos = await PrivateVideo.find({ tags: { $in: tags } });
        }

        return videos;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = {
    getRecommendedVideos
};
