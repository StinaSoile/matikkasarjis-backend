"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
router.get("/:comicName/:imageName", (req, res) => {
    const comicName = req.params.comicName;
    const imageName = req.params.imageName;
    const imagePath = path_1.default.join(__dirname, `../../../public/images/${comicName}`, imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send("Image not found");
        }
    });
});
router.get("/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path_1.default.join(__dirname, "../../../public/images", imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send("Image not found");
        }
    });
});
exports.default = router;
