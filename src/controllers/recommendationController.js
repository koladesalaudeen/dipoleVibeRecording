const recommendationService = require('../services/recommendationService');

async function getRecommendedVideos(req, res) {
    try {
        const { tags, public, private } = req.query;

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing tags.' });
        }

        let isPublic = true;

        if (private) {
            isPublic = false;
        }


        const recommendedVideos = await recommendationService.getRecommendedVideos(tags, isPublic);

        res.status(200).json({ recommendedVideos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching recommended videos.' });
    }
}

module.exports = {
    getRecommendedVideos
};
