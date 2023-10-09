// const ffmpeg = require('fluent-ffmpeg');
// const ffprobe = require('ffprobe');
// const  axios  =  require('axios');
// const  FormData  =  require('form-data');
// const speech =require('@google-cloud/speech');
// const { Readable } =  require('stream');
// const { Storage } = require('@google-cloud/storage');

// const client = new speech.SpeechClient();
// const storage = new Storage();


// const bufferToStream = (buffer) => {
//   const audioStream = Readable.from(buffer);
//   return audioStream;
// }



// async function convertToFlac(inputBuffer) {
//   // Check the format of the inputBuffer using ffprobe
// //   try {
// //     const probeData = ffprobe(inputBuffer);
// //     const audioStream = probeData.streams.find((stream) => stream.codec_type === 'audio');

// //     if (!audioStream || audioStream.codec_name !== 'wav') {
// //       throw new Error('Unsupported audio format. Only pcm_s16le audio is supported.');
// //     }
// //   } catch (err) {
// //     throw new Error('Invalid audio input. Please provide valid audio data.');
// //   }

//   return new Promise((resolve, reject) => {
//     const command = ffmpeg()
//       .input(inputBuffer)
//       .audioCodec('flac')
//       .format('flac')
//       .pipe();

//     command.on('end', () => {
//       console.log('Conversion finished');
//       resolve();
//     });

//     command.on('error', (err) => {
//       console.error('Error:', err);
//       reject(err);
//     });

//     // Stream the output to a buffer
//     const outputBuffer = [];
//     command.on('data', (chunk) => {
//       outputBuffer.push(chunk);
//     });

//     command.on('end', () => {
//       const convertedData = Buffer.concat(outputBuffer);
//       resolve(convertedData);
//     });
//   });
// }


//   async function uploadBase64ToBucket(audioBlob, objectName) {
//     const bucketName ='dipole-vibe-recordings';
//     try {
//       const binaryData = Buffer.from(base64String, 'base64');
  
//       await storage.bucket(bucketName).file(objectName).save(binaryData);
  
//       const fileURI = `gs://${bucketName}/${objectName}`;
  
//       console.log(`audio file uploaded as "${objectName}" to ${bucketName}.`);
  
//       return fileURI;
//     } catch (error) {
//       console.error(`Error uploading MP4 file: ${error.message}`);
//     }
//   }

//    async function transcribeAudio(audioBlob){
//     //const recordURI = await uploadBase64MP4ToBucket(audioBlob, 'testRecord');
  
//     const audio = {
//        //uri: 'gs://dipole-vibe-recordings/samAudio.flac',
//        uri: 'gs://dipole-vibe-recordings/audio.flac'
//     };
  
//     const config = {
//       encoding: 'FLAC',
//       sampleRateHertz: 44100,
//       languageCode: 'en-US',
//       audioChannelCount: 2
//     };
  
//     const request = {
//       audio: audio,
//       config: config,
//     };
  
//     try{
//       const [operation] = await client.longRunningRecognize(request);
//       const [response] = await operation.promise();
  
//       const transcription = response.results
//       .map(result => result.alternatives[0].transcript)
//       .join('\n');
  
//       console.log(`Transcription: ${transcription}`);
//     }
//     catch(error){
//       console.error(`speech-to-text error: ${error.message}`);
//     }
//   }

//   async function processAudio(audioBlob){
//     convertToFlac(inputBuffer, callback);
//     uploadBase64ToBucket(audioBlob, objectName)
//     transcribeAudio(audioBlob)
//   }


// async function initializeQueue(audioBuffer) {
//   const transcriptionQueue = new Queue('transcriptionQueue');
//   let transcriptionResult;

//   transcriptionQueue.process(async () => {
//     console.log("here!!");
//     try {
//       transcriptionResult = await openai.audio.transcriptions.create({
//         file: fs.createReadStream(audioBuffer),
//         model: "whisper-1",
//       });

//       return transcriptionResult.text;
//     } catch (error) {
//       console.error('Error transcribing video:', error);
//       throw error;
//     }
//   });

//   return transcriptionQueue;
// }

  // module.exports = {transcribeAudio,
  //                   convertToFlac,
  //                   bufferToStream,
  //                   whisperTranscribe
  //                  };


const Queue = require('bull');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const createReadStream = fs.createReadStream;

const OpenAIAPIKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OpenAIAPIKey
});

const initializeQueue = async (audioBuffer) => {
  try {
    const tempFilePath = 'audio.m4a';

    await writeFileAsync(tempFilePath, audioBuffer);

    const audioStream = createReadStream(tempFilePath);

    transcriptionResult = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
    });

    fs.unlinkSync(tempFilePath);
    console.log(transcriptionResult.text);
    return transcriptionResult.text;
  } catch (error) {
    console.error('Error transcribing video:', error);
    throw error;
  }
}

function handleVideoSubmission(transcriptionQueue) {
  return async (req, res) => {
    const videoFile = req.files.video;

    const fileId = uuidv4();
    const filePath = path.join(__dirname, 'uploads', `${fileId}.mp4`);

    videoFile.mv(filePath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      const job = await transcriptionQueue.add({ videoFilePath: filePath });

      res.json({ jobId: job.id });
    });
  };
}

async function whisperTranscribe (buffer) {
    const formData = new FormData();
    const audioStream = bufferToStream(buffer);
    formData.append('file', audioStream, { filename: 'audio.m4a', contentType: 'm4a' });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    const  config  = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };  
    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
        const transcription = response.data.text;
        return transcription;
      } catch (error) {
        console.error(`Error connecting openai whisper ${error.message}`);
      }

    throw new Error('Max retries reached');
}

module.exports = {
  handleVideoSubmission,
  whisperTranscribe,
  initializeQueue
};
