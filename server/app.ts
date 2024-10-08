import express, { Application } from "express";
import imageRouter from "./routes/images";
import comicRouter from "./routes/comics";
import cors from "cors";

export const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api/images", imageRouter);

app.use("/api/comics", comicRouter);
