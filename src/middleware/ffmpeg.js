const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function ffmpegConversionMiddleware(req, res, next) {

  const blob = req.file.buffer;
     // Create a temporary file with a unique name
  const tempFileName = `temp_${Date.now()}.webm`;
  const tempFilePath = `./${tempFileName}`;

  // Write the Blob data to the temporary file
  fs.writeFileSync(tempFilePath, blob);

  try {
    // Run the FFmpeg command to convert the WebM to MP4
    const outputFileName = tempFileName.replace('.webm', '.mp4');
    const cmd = `ffmpeg -i "${tempFilePath}" -r 15 -c:v copy -c:a aac -strict experimental "${outputFileName}"`;
    const { stdout, stderr } = await exec(cmd);

    console.error('[conv] FFmpeg stderr:', stderr);

    if (fs.existsSync(outputFileName)) {
      // console.log(`[conv] Conversion successful. Output file: ${outputFileName}`);

      req.convertedVideo = fs.readFileSync(outputFileName);

      next();
    } else {
      console.error('[conv] Conversion failed.');
      return null;
    }
  } catch (err) {
    console.error('[conv] Error during conversion:', err);
    return null;
  } finally {
    // Clean up: remove the temporary file
    fs.unlinkSync(tempFilePath);
    console.log("temp file removed successfully");
  }
}

async function extractAndUploadAudio(req, res, next) {
  const blob = req.file.buffer;
  const tempFileName = `temp_${Date.now()}.webm`;
  const tempFilePath = `./${tempFileName}`;

  fs.writeFileSync(tempFilePath, blob);

  try {
    const outputFileName = tempFileName.replace('.webm', '.flac'); // Change the output format to AAC audio
    const cmd = `ffmpeg -i "${tempFilePath}" -vn -acodec flac "${outputFileName}"`;
    const { stdout, stderr } = await exec(cmd);

    console.error('[audio-extract] FFmpeg stderr:', stderr);

    if (fs.existsSync(outputFileName)) {
      req.extractedAudio = fs.readFileSync(outputFileName);
      next();
    } else {
      console.error('[audio-extract] Audio extraction failed.');
      return res.status(500).json({ error: 'Audio extraction failed.' });
    }
  } catch (err) {
    console.error('[audio-extract] Error during audio extraction:', err);
    return res.status(500).json({ error: 'Error during audio extraction.' });
  } finally {
    fs.unlinkSync(tempFilePath);
    console.log('[audio-extract] Temporary file removed successfully');
  }
}

module.exports = {
  ffmpegConversionMiddleware,
  extractAndUploadAudio,
 };