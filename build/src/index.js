"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const images_1 = __importDefault(require("./routes/images"));
const comics_1 = __importDefault(require("./routes/comics"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use((0, cors_1.default)());
const PORT = 3000;
// kaikki kuvat saadaan public-kansiosta yksittäin,
// esim osoitteella http://localhost:3000/images/velhontaloudenhoitaja/velhontaloudenhoitaja-etusivu.png
// app.use("/images", express.static(path.join(__dirname, "./public/images")));
app.use("/api/images", images_1.default);
app.use("/api/comics", comics_1.default);
// saadaan lista kaikkien kuvien urleja.
// En tiedä mitä tällä tehdään, mutta toistaiseksi on tällainen jos tarvitsee.
app.get("/api/imagelist", (_req, res) => {
    const imageListPath = path_1.default.join(__dirname, "../../public/generatedImageUrls.json");
    fs_1.default.readFile(imageListPath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to read image list" });
            return;
        }
        res.json(JSON.parse(data));
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
