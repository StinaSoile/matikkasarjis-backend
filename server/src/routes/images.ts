import express from "express";
import path from "path";
const router = express.Router();

router.get("/:comicName/:imageName", (req, res) => {
  const comicName = req.params.comicName;
  const imageName = req.params.imageName;
  const imagePath = path.join(
    __dirname,
    `../../../public/images/${comicName}`,
    imageName
  );

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    }
  });
});

router.get("/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "../../../public/images", imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    }
  });
});

export default router;
