import { Page, PageWithNoAnswer, QuestionWithNoAnswer } from "../types";
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

const getPagesByKey = (key: string, pageList: Page[]): Page[] => {
  const index = getIndexByKey(key, pageList);
  return getPagesByIndex(index, pageList); //jos index=-1, tämä palauttaa tyhjän taulukon
};

const getOnePage = (page: string, pageList: (Page | PageWithNoAnswer)[]) => {
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

const changeLastPage = (pagesToReturn: Page[]): (Page | PageWithNoAnswer)[] => {
  const lastPage = pagesToReturn[pagesToReturn.length - 1];
  let newQuestionList: QuestionWithNoAnswer[] = [];
  if (lastPage.questionList) {
    for (let i = 0; i < lastPage.questionList.length; i++) {
      newQuestionList = [
        ...newQuestionList,
        { question: lastPage.questionList[i].question },
      ];
    }
  }
  const lastPageWithoutAnswer: PageWithNoAnswer = {
    key: lastPage.key,
    pictureName: lastPage.pictureName,
    questionList: newQuestionList,
  };
  const newPages: (Page | PageWithNoAnswer)[] = [...pagesToReturn];
  newPages[newPages.length - 1] = lastPageWithoutAnswer;
  return newPages;
};

const getPagesToReturn = (
  key: string | undefined,
  comic: Page[]
): (Page | PageWithNoAnswer)[] => {
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

export default {
  getOnePage,
  returnKeyByAnswer,
  getPagesToReturn,
};
