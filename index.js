import express from "express";
import fs from "fs";
import { exec } from "child_process";
import { v4 as uuid } from "uuid";
import YtDlpWrap from "yt-dlp-wrap";

const app = express();
app.use(express.json());

const ytDlp = new YtDlpWrap();
const PORT = process.env.PORT || 3000;

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL kosong" });

    const id = uuid();
    const raw = `temp/${id}_raw.mp4`;
    const out = `temp/${id}.mp4`;

    // Download kualitas tinggi
    await ytDlp.exec([
      url,
      "-f", "bv*+ba/b",
      "-o", raw
    ]);

    // Compress (WA friendly)
    exec(
      `ffmpeg -i ${raw} -vf scale=1280:-2 -b:v 1500k -b:a 128k ${out}`,
      () => {
        fs.unlinkSync(raw);
        res.json({
          success: true,
          file: `/file/${id}.mp4`
        });
      }
    );

  } catch (e) {
    res.status(500).json({ error: "Gagal proses video" });
  }
});

app.use("/file", express.static("temp"));

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT);
});
