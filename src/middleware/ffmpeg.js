// const { spawn } = require('child_process');

// function ffmpegConversionMiddleware(req, res, next) {

//     console.log("Here!!!");
//   const ffmpegProcess = spawn('ffmpeg', [
//     '-i', '-',          // Input from stdin
//     '-c:v', 'libx264',  // Video codec for MP4 (H.264)
//     '-c:a', 'aac',      // Audio codec for MP4 (AAC)
//     '-strict', 'experimental',
//     '-f', 'mp4',        // Output format is MP4
//     '-movflags', '+faststart', // Enable fast start for streaming
//     '-preset', 'fast',  // Encoding preset (fast)
//     '-crf', '23',       // Constant Rate Factor (quality, lower is better, 23 is default)
//     '-b:a', '128k',     // Audio bitrate (adjust as needed)
//     '-vf', 'scale=640:-1', // Video scale (adjust width as needed, -1 to maintain aspect ratio)
//     '-y',               // Overwrite output file if it exists
//     '-'                 // Output to stdout
//   ]);

// //   req.pipe(ffmpegProcess.stdin);

// //   const chunks = [];

// //   ffmpegProcess.stdout.on('data', (data) => {
// //     console.log('FFmpeg data:', data.toString()); // Log FFmpeg data
// //     chunks.push(data);
// //   });

//   ffmpegProcess.stderr.on('data', (data) => {
//     console.error(`FFmpeg error!!: ${data}`);
//   });

//   ffmpegProcess.on('close', (code) => {
//     if (code === 0) {
//       console.log('Conversion completed successfully.');
//       const convertedVideo = Buffer.concat(chunks);
//       req.convertedVideo = convertedVideo;
//       next(); // Continue to the next middleware or route handler
//     } else {
//       console.error(`FFmpeg process exited with code ${code}`);
//       res.status(500).json({ error: 'Video conversion failed.' });
//     }
//   });
// }

// module.exports = ffmpegConversionMiddleware;
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
  }
}


module.exports = ffmpegConversionMiddleware;