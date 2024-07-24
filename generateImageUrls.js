/* eslint-disable @typescript-eslint/no-var-requires */
// import fs from 'fs';
const fs = require("fs");
// import path from 'path';
const path = require("path");

const directories = ["./public/images/siivetonlepakko", "./public/images/velhontaloudenhoitaja"];
const outputFilePath = "./public/generatedImageUrls.json";

const generateImageUrls = () => {
    let imageUrls = {};

    directories.forEach((dir) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const fileUrl = `/images/${path.basename(dir)}/${file}`;
            imageUrls[file] = fileUrl;
        });
    });

    const content = JSON.stringify(imageUrls, null, 2);
    fs.writeFileSync(outputFilePath, content);
};

generateImageUrls();
