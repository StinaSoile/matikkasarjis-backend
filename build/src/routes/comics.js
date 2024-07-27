"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comicData_1 = require("../../data/comicData");
const comicData_2 = require("../../data/comicData");
const comicService_1 = __importDefault(require("../services/comicService"));
const router = express_1.default.Router();
// Postaa tietyn sarjakuvan tiettyyn sivuun liittyvät vastaukset tämän sivun osoitteeseen.
// palauttaa keyn, joka avaa seuraavat sarjakuvasivut, jos vastaukset ovat oikein.
// Jos kyseessä on sivu 0 eli etusivu, palauttaa suoraan ensimmäisen tehtäväsivun keyn.
// Jos vastaus on väärä, palauttaa keyn, joka vastaa sivua, jonka kysymyksiin tässä yritetään vastata.
router.post("/siivetonlepakko/:page", (req, res) => {
    try {
        const key = comicService_1.default.returnKeyByAnswer(req.body, req.params.page, comicData_1.SiivetonLepakkoTypedPages);
        return res.json(key);
    }
    catch (error) {
        let errMsg = "Something went wrong.";
        if (error instanceof Error) {
            errMsg = error.message;
        }
        return res.status(400).send(errMsg);
    }
});
router.post("/velhontaloudenhoitaja/:page", (req, res) => {
    try {
        const key = comicService_1.default.returnKeyByAnswer(req.body, req.params.page, comicData_2.VelhonTaloudenhoitajaTypedPages);
        return res.json(key);
    }
    catch (error) {
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
    const key = req.query.key;
    try {
        const pagesToReturn = comicService_1.default.getPagesToReturn(key, comicData_1.SiivetonLepakkoTypedPages);
        return res.json(pagesToReturn);
    }
    catch (error) {
        let errMsg = "Something went wrong.";
        if (error instanceof Error) {
            errMsg = error.message;
        }
        return res.status(400).send(errMsg);
    }
});
router.get("/velhontaloudenhoitaja", (req, res) => {
    const key = req.query.key;
    try {
        const pagesToReturn = comicService_1.default.getPagesToReturn(key, comicData_2.VelhonTaloudenhoitajaTypedPages);
        return res.json(pagesToReturn);
    }
    catch (error) {
        let errMsg = "Something went wrong.";
        if (error instanceof Error) {
            errMsg = error.message;
        }
        return res.status(400).send(errMsg);
    }
});
// yksittäiset sivut kysymyksineen ja vastauksineen, rajoitettu keyn perusteella
router.get("/siivetonlepakko/:page", (req, res) => {
    const key = req.query.key;
    try {
        const pagesToReturn = comicService_1.default.getPagesToReturn(key, comicData_1.SiivetonLepakkoTypedPages);
        return res.json(comicService_1.default.getOnePage(req.params.page, pagesToReturn));
    }
    catch (error) {
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
        return res.json(comicService_1.default.getOnePage(req.params.page, comicData_2.VelhonTaloudenhoitajaTypedPages));
    }
    catch (error) {
        let errMsg = "Something went wrong.";
        if (error instanceof Error) {
            errMsg = error.message;
        }
        return res.status(400).send(errMsg);
    }
});
exports.default = router;
