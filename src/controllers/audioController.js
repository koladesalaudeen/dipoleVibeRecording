const audioService = require('../services/audioServices');

async function transcribeAudio(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Invalid request. Please provide audioStream in the request body." });
        }

        const audioBlob  = req.file.buffer;

        //const transcriptionResult = await audioService.whisperTranscribe(audioBlob);
        const transcriptionResult = await audioService.initializeQueue(audioBlob)

        if (typeof transcriptionResult !== 'string' || transcriptionResult.trim() === '') {
            return res.status(500).json({ message: "Invalid transcription result. Please check the audio data." });
        }

        return res.status(200).json({ message: "Audio transcribed successfully", transcriptionResult });
    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "An unexpected error occurred while transcribing audio." });
    }
}

module.exports = { transcribeAudio };
