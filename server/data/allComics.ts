import { Comic } from "../src/types";
import { SiivetonLepakkoTypedPages } from "./comicData";
import { VelhonTaloudenhoitajaTypedPages } from "./comicData";

export const Comics: Comic[] = [
  {
    comicName: "siivetonlepakko",
    alt: "Siivettömän lepakon matka -sarjakuva",
    description: { name: "Siivettömän lepakon matka", level: "4. luokka" },
    comicpages: SiivetonLepakkoTypedPages,
  },
  {
    comicName: "velhontaloudenhoitaja",
    alt: "Velhon taloudenhoitaja -sarjakuva",
    description: {
      name: "Velhon taloudenhoitaja",
      level: "8. luokka",
    },
    comicpages: VelhonTaloudenhoitajaTypedPages,
  },
];
