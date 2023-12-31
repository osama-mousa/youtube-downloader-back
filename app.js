const express = require("express");
const app = express();
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
  const link = req.body.link;
  links.push(link);
  try {
    const filePath = await downloadVideo(link);
    const filename = path.basename(filePath);
    const absolutePath = path.resolve(filePath);
    console.log(`Video downloaded successfully: ${filename}`);

    // إرسال الملف كاستجابة
    res.setHeader("Content-Type", "video/mp4");
    res.download(absolutePath, filename, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("File sent successfully");
        fs.unlinkSync(absolutePath);
      }
    });
  } catch (error) {
    console.error(`Error downloading video: ${error}`);
    res.status(404).send("The download link not found.");
  }
});

function downloadVideo(link) {
  return new Promise((resolve, reject) => {
    const command = `python YouTube.py ${link}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
