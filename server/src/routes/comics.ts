import express from "express";
import comicService from "../services/comicService";
import { Comic } from "../types";
const router = express.Router();

// Postaa tietyn sarjakuvan tiettyyn sivuun liittyvät vastaukset tämän sivun osoitteeseen.
// palauttaa keyn, joka avaa seuraavat sarjakuvasivut, jos vastaukset ovat oikein.
// Jos kyseessä on sivu 0 eli etusivu, palauttaa suoraan ensimmäisen tehtäväsivun keyn.
// Jos vastaus on väärä, palauttaa keyn, joka vastaa sivua, jonka kysymyksiin tässä yritetään vastata.
router.post("/:comicName/:page", (req, res) => {
  let comic: Comic;
  try {
    comic = comicService.getComic(req.params.comicName);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(404).send(errMsg);
  }
  try {
    const key = comicService.returnKeyByAnswer(
      req.body,
      req.params.page,
      comic.comicpages
    );
    return res.json(key);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

// Palauttaa sarjakuvan kaikki sivut jotka saa sillä avaimella, joka on getin mukana queryssa
// Listan viimeinen, ts se jonka key on annettu, palautetaan ilman tietoja oikeista vastauksista.
router.get("/:comicName", (req, res) => {
  let comic: Comic;
  try {
    comic = comicService.getComic(req.params.comicName);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(404).send(errMsg);
  }
  const key = req.query.key as string | undefined;
  try {
    const pagesToReturn = comicService.getPagesToReturn(key, comic.comicpages);

    return res.json(pagesToReturn);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

// yksittäiset sivut kysymyksineen ja vastauksineen, rajoitettu keyn perusteella
router.get("/:comicName/:page", (req, res) => {
  let comic: Comic;
  try {
    comic = comicService.getComic(req.params.comicName);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(404).send(errMsg);
  }
  const key = req.query.key as string | undefined;
  try {
    const pagesToReturn = comicService.getPagesToReturn(key, comic.comicpages);
    return res.json(comicService.getOnePage(req.params.page, pagesToReturn));
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

export default router;
