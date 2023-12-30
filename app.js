const express = require('express');
const app = express();
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');

// Disable update check for ytdl-core
process.env.YTDL_NO_UPDATE = true;

app.use(cors());
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('I am Listening in port 3000');
});

const links = [];

app.post('/api/downloadVideo', async (req, res) => {
  const link = req.body.link;
  links.push(link);
  try {
    const videoInfo = await ytdl.getInfo(link);
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });

    if (!format) {
      console.error('No suitable format found');
      res.status(500).send('Internal Server Error');
      return;
    }

    const videoStream = ytdl(link, { quality: 'highest' });

    const filename = `${videoInfo.title}.mp4`;
    const filePath = path.join(__dirname, filename);
    const file = fs.createWriteStream(filePath);

    videoStream.pipe(file);

    file.on('finish', () => {
      console.log(`Video downloaded successfully: ${filename}`);

      res.setHeader('Content-Type', 'video/mp4');
      res.sendFile(filePath, filename, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('File sent successfully');
          fs.unlinkSync(filePath);
        }
      });
    });

  } catch (error) {
    console.error(`Error downloading video: ${error.message}`);
    res.status(404).send('The download link not found.');
  }
});
