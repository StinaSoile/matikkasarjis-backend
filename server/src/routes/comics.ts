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
      console.log(comics);
      res.json(comics);
    })
    .catch((error: unknown) => {
      handleError(error, res);
    });
});

// Postaa tietyn sarjakuvan tiettyyn sivuun liittyvät vastaukset tämän sivun osoitteeseen.
// palauttaa keyn, joka avaa seuraavat sarjakuvasivut, jos vastaukset ovat oikein.
// Jos kyseessä on sivu 0 eli etusivu, palauttaa suoraan ensimmäisen tehtäväsivun keyn.
// Jos vastaus on väärä, palauttaa keyn, joka vastaa sivua, jonka kysymyksiin tässä yritetään vastata.
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

// Palauttaa sarjakuvan kaikki sivut jotka saa sillä avaimella, joka on getin mukana queryssa
// Listan viimeinen, ts se jonka key on annettu, palautetaan ilman tietoja oikeista vastauksista.
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

// yksittäiset sivut kysymyksineen ja vastauksineen, rajoitettu keyn perusteella
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
