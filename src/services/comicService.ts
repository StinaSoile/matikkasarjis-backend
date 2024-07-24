import { Page } from "../types";
import {
  stringToNumber,
  toStringList,
  checkIfRightAnswer,
  findNextKey,
  findCurrentKey,
  isFirstPage,
} from "../utils";

const getIndexByKey = (key: string, pageList: Page[]): number => {
  return pageList.findIndex((page) => page.key === key);
};

const getPagesByIndex = (index: number, pageList: Page[]): Page[] => {
  return pageList.slice(0, index + 1);
};

// RENAME
const getPagesToReturn = (key: string, pageList: Page[]): Page[] => {
  const index = getIndexByKey(key, pageList);
  return getPagesByIndex(index, pageList); //jos index=-1, tämä palauttaa tyhjän taulukon
};

const getOnePage = (page: string, pageList: Page[]) => {
  return pageList[stringToNumber(page)];
};

const returnKeyByAnswer = (
  body: unknown,
  pageString: string,
  comic: Page[]
): string => {
  const answers = toStringList(body);
  const page = stringToNumber(pageString);
  let key: string = "";
  if (isFirstPage(page)) {
    key = findNextKey(comic, page);
  } else {
    if (checkIfRightAnswer(comic, page, answers))
      key = findNextKey(comic, page);
    else key = findCurrentKey(comic, page);
  }
  return key;
};

// RENAME?
const getPagesByKey = (key: string | undefined, comic: Page[]): Page[] => {
  if (!key) {
    throw new Error("Key is required");
  }
  const pagesToReturn = getPagesToReturn(key, comic);
  if (pagesToReturn.length === 0) {
    throw new Error("There is no page with this key");
  }

  return pagesToReturn;
};

export default {
  getPagesToReturn,
  getOnePage,
  returnKeyByAnswer,
  getPagesByKey,
};
