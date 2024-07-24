/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from "express";
import path from "path";
const router = express.Router();
router.get("/siivetonlepakko/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(
    __dirname,
    "../../public/images/siivetonlepakko",
    imageName
  );

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    }
  });

  // res.send("imagerouter running");
});

router.get("/velhontaloudenhoitaja/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(
    __dirname,
    "../../public/images/velhontaloudenhoitaja",
    imageName
  );

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    }
  });

  // res.send("imagerouter running");
});

export default router;
