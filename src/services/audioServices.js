const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe');
const  axios  =  require('axios');
const  FormData  =  require('form-data');
const speech =require('@google-cloud/speech');
const { Readable } =  require('stream');
const { Storage } = require('@google-cloud/storage');

const client = new speech.SpeechClient();
const storage = new Storage();


const bufferToStream = (buffer) => {
  const audioStream = Readable.from(buffer);
  return audioStream;
}

async function whisperTranscribe (buffer) {
    const  formData  =  new  FormData();
    const  audioStream  =  bufferToStream(buffer);
    formData.append('file', audioStream, { filename: 'audio.m4a', contentType: 'm4a' });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    const  config  = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    };
    let retries = 3; // Number of retries
    const delayMs = 60000; // Delay in milliseconds between retries
  
    while (retries > 0) {
      try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
        const transcription = response.data.text;
        return transcription;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Rate limited, retry after a delay
          await new Promise(resolve => setTimeout(resolve, delayMs));
          retries--;
        } else {
          // Handle other errors
          throw error;
        }
      }
    }

    throw new Error('Max retries reached');
}

async function convertToFlac(inputBuffer) {
  // Check the format of the inputBuffer using ffprobe
//   try {
//     const probeData = ffprobe(inputBuffer);
//     const audioStream = probeData.streams.find((stream) => stream.codec_type === 'audio');

//     if (!audioStream || audioStream.codec_name !== 'wav') {
//       throw new Error('Unsupported audio format. Only pcm_s16le audio is supported.');
//     }
//   } catch (err) {
//     throw new Error('Invalid audio input. Please provide valid audio data.');
//   }

  return new Promise((resolve, reject) => {
    const command = ffmpeg()
      .input(inputBuffer)
      .audioCodec('flac')
      .format('flac')
      .pipe();

    command.on('end', () => {
      console.log('Conversion finished');
      resolve();
    });

    command.on('error', (err) => {
      console.error('Error:', err);
      reject(err);
    });

    // Stream the output to a buffer
    const outputBuffer = [];
    command.on('data', (chunk) => {
      outputBuffer.push(chunk);
    });

    command.on('end', () => {
      const convertedData = Buffer.concat(outputBuffer);
      resolve(convertedData);
    });
  });
}


  async function uploadBase64ToBucket(audioBlob, objectName) {
    const bucketName ='dipole-vibe-recordings';
    try {
      const binaryData = Buffer.from(base64String, 'base64');
  
      await storage.bucket(bucketName).file(objectName).save(binaryData);
  
      const fileURI = `gs://${bucketName}/${objectName}`;
  
      console.log(`audio file uploaded as "${objectName}" to ${bucketName}.`);
  
      return fileURI;
    } catch (error) {
      console.error(`Error uploading MP4 file: ${error.message}`);
    }
  }

   async function transcribeAudio(audioBlob){
    //const recordURI = await uploadBase64MP4ToBucket(audioBlob, 'testRecord');
  
    const audio = {
       //uri: 'gs://dipole-vibe-recordings/samAudio.flac',
       uri: 'gs://dipole-vibe-recordings/audio.flac'
    };
  
    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 44100,
      languageCode: 'en-US',
      audioChannelCount: 2
    };
  
    const request = {
      audio: audio,
      config: config,
    };
  
    try{
      const [operation] = await client.longRunningRecognize(request);
      const [response] = await operation.promise();
  
      const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  
      console.log(`Transcription: ${transcription}`);
    }
    catch(error){
      console.error(`speech-to-text error: ${error.message}`);
    }
  }

  async function processAudio(audioBlob){
    convertToFlac(inputBuffer, callback);
    uploadBase64ToBucket(audioBlob, objectName)
    transcribeAudio(audioBlob)
  }


  module.exports = {transcribeAudio,
                    convertToFlac,
                    bufferToStream,
                    whisperTranscribe
                   };