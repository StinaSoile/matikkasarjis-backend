import express from "express";
import comicService from "../services/comicService";
import { Comic } from "../types";
const router = express.Router();

const handleError = (error: unknown, res: express.Response) => {
  let errMsg = "Something went wrong.";
  if (error instanceof Error) {
    errMsg = error.message;
    if (errMsg.includes("Comic does not exist")) {
      return res.status(404).send(errMsg);
    }
  }
  return res.status(400).send(errMsg);
};

router.get("/", (_req, res) => {
  comicService
    .getAllComics()
    .then((comics) => {
      res.json(comics);
    })
    .catch((error: unknown) => {
      handleError(error, res);
    });
});

router.post("/:comicName/:page", (req, res) => {
  const postPage = async () => {
    try {
      const comic: Comic = await comicService.getComic(req.params.comicName);
      const key = comicService.returnKeyByAnswer(
        req.body,
        req.params.page,
        comic.comicpages
      );
      return res.json(key);
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };
  postPage();
});

router.get("/:comicName", (req, res) => {
  const postComic = async () => {
    try {
      const comic: Comic = await comicService.getComic(req.params.comicName);
      const key = req.query.key as string | undefined;
      const pagesToReturn = comicService.getPagesToReturn(
        key,
        comic.comicpages
      );
      return res.json(pagesToReturn);
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };
  postComic();
});

router.get("/:comicName/:page", (req, res) => {
  const getPage = async () => {
    try {
      const comic: Comic = await comicService.getComic(req.params.comicName);
      const key = req.query.key as string | undefined;
      const pagesToReturn = comicService.getPagesToReturn(
        key,
        comic.comicpages
      );
      return res.json(comicService.getOnePage(req.params.page, pagesToReturn));
    } catch (error: unknown) {
      return handleError(error, res);
    }
  };
  getPage();
});

export default router;
