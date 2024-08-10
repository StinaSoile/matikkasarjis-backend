import express, { Application } from "express";
import path from "path";
import fs from "fs";
import imageRouter from "./routes/images";
import comicRouter from "./routes/comics";

import cors from "cors";

export const app: Application = express();
app.use(express.json());
app.use(cors());

// kaikki kuvat saadaan public-kansiosta yksittäin,
// esim osoitteella http://localhost:3000/images/velhontaloudenhoitaja/velhontaloudenhoitaja-etusivu.png
// app.use("/images", express.static(path.join(__dirname, "./public/images")));

app.use("/api/images", imageRouter);

app.use("/api/comics", comicRouter);

// saadaan lista kaikkien kuvien urleja.
// En tiedä mitä tällä tehdään, mutta toistaiseksi on tällainen jos tarvitsee.
app.get("/api/imagelist", (_req, res) => {
  const imageListPath = path.join(
    __dirname,
    "../../public/generatedImageUrls.json"
  );
  fs.readFile(imageListPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read image list" });
      return;
    }
    res.json(JSON.parse(data));
  });
});
