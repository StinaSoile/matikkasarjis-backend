"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const getIndexByKey = (key, pageList) => {
    return pageList.findIndex((page) => page.key === key);
};
const getPagesByIndex = (index, pageList) => {
    return pageList.slice(0, index + 1);
};
const getPagesByKey = (key, pageList) => {
    const index = getIndexByKey(key, pageList);
    return getPagesByIndex(index, pageList);
};
const getOnePage = (page, pageList) => {
    return pageList[(0, utils_1.stringToNumber)(page)];
};
const returnKeyByAnswer = (body, pageString, comic) => {
    const page = (0, utils_1.stringToNumber)(pageString);
    let key = "";
    if ((0, utils_1.isFirstPage)(page)) {
        key = (0, utils_1.findNextKey)(comic, page);
    }
    else {
        const answers = (0, utils_1.toStringList)(body);
        if ((0, utils_1.checkIfRightAnswer)(comic, page, answers))
            key = (0, utils_1.findNextKey)(comic, page);
        else
            key = (0, utils_1.findCurrentKey)(comic, page);
    }
    return key;
};
const changeLastPage = (pagesToReturn) => {
    const lastPage = pagesToReturn[pagesToReturn.length - 1];
    let newQuestionList = [];
    if (lastPage.questionList) {
        for (let i = 0; i < lastPage.questionList.length; i++) {
            newQuestionList = [
                ...newQuestionList,
                { question: lastPage.questionList[i].question },
            ];
        }
    }
    const lastPageWithoutAnswer = {
        key: lastPage.key,
        pictureName: lastPage.pictureName,
        questionList: newQuestionList,
    };
    const newPages = [...pagesToReturn];
    newPages[newPages.length - 1] = lastPageWithoutAnswer;
    return newPages;
};
const getPagesToReturn = (key, comic) => {
    if (!key) {
        throw new Error("Key is required");
    }
    const pagesToReturn = getPagesByKey(key, comic);
    if (pagesToReturn.length === 0) {
        throw new Error("There is no page with this key");
    }
    const newPages = changeLastPage(pagesToReturn);
    return newPages;
};
exports.default = {
    getOnePage,
    returnKeyByAnswer,
    getPagesToReturn,
};
