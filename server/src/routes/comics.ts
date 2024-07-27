import express from "express";
import { SiivetonLepakkoTypedPages } from "../../data/comicData";
import { VelhonTaloudenhoitajaTypedPages } from "../../data/comicData";
import comicService from "../services/comicService";
const router = express.Router();

// Postaa tietyn sarjakuvan tiettyyn sivuun liittyvät vastaukset tämän sivun osoitteeseen.
// palauttaa keyn, joka avaa seuraavat sarjakuvasivut, jos vastaukset ovat oikein.
// Jos kyseessä on sivu 0 eli etusivu, palauttaa suoraan ensimmäisen tehtäväsivun keyn.
// Jos vastaus on väärä, palauttaa keyn, joka vastaa sivua, jonka kysymyksiin tässä yritetään vastata.
router.post("/siivetonlepakko/:page", (req, res) => {
  try {
    const key = comicService.returnKeyByAnswer(
      req.body,
      req.params.page,
      SiivetonLepakkoTypedPages
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
router.post("/velhontaloudenhoitaja/:page", (req, res) => {
  try {
    const key = comicService.returnKeyByAnswer(
      req.body,
      req.params.page,
      VelhonTaloudenhoitajaTypedPages
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

// Palauttaa kys. sarjakuvan kaikki sivut jotka saa sillä avaimella, joka on getin mukana queryssa
// Listan viimeinen, ts se jonka key on annettu, palautetaan ilman tietoja oikeista vastauksista.
router.get("/siivetonlepakko", (req, res) => {
  const key = req.query.key as string | undefined;
  try {
    const pagesToReturn = comicService.getPagesToReturn(
      key,
      SiivetonLepakkoTypedPages
    );

    return res.json(pagesToReturn);
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

router.get("/velhontaloudenhoitaja", (req, res) => {
  const key = req.query.key as string | undefined;
  try {
    const pagesToReturn = comicService.getPagesToReturn(
      key,
      VelhonTaloudenhoitajaTypedPages
    );

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
router.get("/siivetonlepakko/:page", (req, res) => {
  const key = req.query.key as string | undefined;
  try {
    const pagesToReturn = comicService.getPagesToReturn(
      key,
      SiivetonLepakkoTypedPages
    );
    return res.json(comicService.getOnePage(req.params.page, pagesToReturn));
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

// yksittäiset sivut kysymyksineen ja vastauksineen, ei rajoitettu
router.get("/velhontaloudenhoitaja/:page", (req, res) => {
  try {
    return res.json(
      comicService.getOnePage(req.params.page, VelhonTaloudenhoitajaTypedPages)
    );
  } catch (error: unknown) {
    let errMsg = "Something went wrong.";

    if (error instanceof Error) {
      errMsg = error.message;
    }
    return res.status(400).send(errMsg);
  }
});

export default router;
