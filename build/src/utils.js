"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFirstPage = exports.findCurrentKey = exports.findNextKey = exports.checkIfRightAnswer = exports.stringToNumber = exports.toStringList = void 0;
const toStringList = (obj) => {
    if (!Array.isArray(obj)) {
        throw new Error("not an array");
    }
    const newObj = [];
    for (let i = 0; i < obj.length; i++) {
        newObj[i] = parseString(obj[i]);
    }
    return newObj;
};
exports.toStringList = toStringList;
const stringToNumber = (string) => {
    const nmb = Number(string);
    if (isNaN(nmb))
        throw new Error(`${string} is not a number`);
    return nmb;
};
exports.stringToNumber = stringToNumber;
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const parseString = (string) => {
    if (!string || !isString(string)) {
        throw new Error("Can parse to string");
    }
    return string;
};
const returnPageByIndex = (page, comic) => {
    if (page < comic.length)
        return comic[page];
    throw new Error("Page does not exist");
};
const checkIfRightAnswer = (comic, pageIndex, answers) => {
    const page = returnPageByIndex(pageIndex, comic);
    if (!page || !page.questionList)
        return false;
    if (page.questionList.length !== answers.length)
        return false;
    let rightAnswer = true;
    for (let i = 0; i < page.questionList.length; i++) {
        if (answers[i] != page.questionList[i].answer) {
            rightAnswer = false;
        }
    }
    return rightAnswer;
};
exports.checkIfRightAnswer = checkIfRightAnswer;
const findNextKey = (comic, page) => {
    for (let i = page + 1; i < comic.length; i++) {
        if (comic[i].key) {
            return comic[i].key; // tässä on oikaistu typescriptin suhteen, ehkä korjaa myöhemmin
        }
    }
    throw new Error("No keys found");
};
exports.findNextKey = findNextKey;
const findCurrentKey = (comic, page) => {
    const i = page;
    if (comic[i].key)
        return comic[i].key;
    else
        throw new Error("No current key found");
};
exports.findCurrentKey = findCurrentKey;
const isFirstPage = (page) => {
    if (page === 0)
        return true;
    return false;
};
exports.isFirstPage = isFirstPage;
