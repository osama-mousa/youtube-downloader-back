const express = require("express");
const app = express();
const ytdl = require('ytdl-core');
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("I am Listening in port 3000");
});

const links = [];

app.post("/api/downloadVideo", async (req, res) => {
  const videoUrl = req.body.link;
  links.push(videoUrl);
  try {
    const info = await ytdl.getInfo(videoUrl);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    const videoStream = ytdl(videoUrl, { format: videoFormat });
    console.log(`Video downloaded successfully: ${info.videoDetails.title}`);

    // res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');
    res.status(201) ;

    videoStream.pipe(res);
  } catch (err) {
    console.error(`Error downloading video: ${err}`);
    console.log(err)
    res.status(500).send(`Error downloading video: ${err.message}`);
  }
});

