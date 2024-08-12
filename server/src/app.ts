import express, { Application } from "express";
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
