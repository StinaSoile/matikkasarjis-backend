import { Comic } from "../src/types";
import { SiivetonLepakkoTypedPages } from "./comicData";
import { VelhonTaloudenhoitajaTypedPages } from "./comicData";

export const Comics: Comic[] = [
  {
    shortName: "siivetonlepakko",
    name: "Siivettömän lepakon matka",
    level: "4. luokka",
    comicpages: SiivetonLepakkoTypedPages,
  },
  {
    shortName: "velhontaloudenhoitaja",
    name: "Velhon taloudenhoitaja",
    level: "8. luokka",

    comicpages: VelhonTaloudenhoitajaTypedPages,
  },
];
