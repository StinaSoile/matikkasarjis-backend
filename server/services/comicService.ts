import { Comic, Page, PageWithNoAnswer, QuestionWithNoAnswer } from "../types";
import {
  stringToNumber,
  toStringList,
  checkIfRightAnswer,
  findNextKey,
  findCurrentKey,
  isFirstPage,
  mapQuestionList,
} from "../utils";
import ComicModel from "../models/comic";

const getIndexByKey = (key: string, pageList: Page[]): number => {
  return pageList.findIndex((page) => page.key === key);
};

const getPagesByIndex = (index: number, pageList: Page[]): Page[] => {
  if (index > -1 && index < pageList.length)
    return pageList.slice(0, index + 1);
  throw new Error("Index out of bounds");
};

const getPagesByKey = (key: string, pageList: Page[]): Page[] => {
  const index = getIndexByKey(key, pageList);
  if (index > -1) return getPagesByIndex(index, pageList);
  throw new Error("There is no page with this key");
};

const getOnePage = (page: string, pageList: (Page | PageWithNoAnswer)[]) => {
  const pagenumber = stringToNumber(page);
  if (pagenumber > -1 && pagenumber < pageList.length)
    return pageList[pagenumber];
  throw new Error("Index out of bounds");
};

const returnKeyByAnswer = (
  body: unknown,
  pageString: string,
  comic: Page[]
): string => {
  const page = stringToNumber(pageString);
  let key: string = "";
  if (isFirstPage(page)) {
    key = findNextKey(comic, page);
  } else {
    const answers = toStringList(body);
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
    const lastPageWithoutAnswer: PageWithNoAnswer = {
      key: lastPage.key,
      pictureName: lastPage.pictureName,
      questionList: newQuestionList,
    };
    const newPages: (Page | PageWithNoAnswer)[] = [...pagesToReturn];
    newPages[newPages.length - 1] = lastPageWithoutAnswer;
    return newPages;
  }
  return pagesToReturn;
};

const getPagesToReturn = (
  key: string | undefined,
  comic: Page[]
): (Page | PageWithNoAnswer)[] => {
  if (!key) {
    throw new Error("Key is required");
  }
  const pagesToReturn = getPagesByKey(key, comic);

  const newPages = changeLastPage(pagesToReturn);

  return newPages;
};

const getComic = async (name: string): Promise<Comic> => {
  const comic = await ComicModel.findOne({ shortName: name });
  if (
    comic &&
    comic.shortName &&
    comic.name &&
    comic.level &&
    comic.comicpages
  ) {
    const comicpages = comic.comicpages.map((page) => {
      const { key, pictureName, questionList } = page.toObject();
      const comicPage = { pictureName } as Page;
      if (key) comicPage.key = key;
      const questions = mapQuestionList(questionList);
      if (questions) comicPage.questionList = questions;
      return comicPage;
    });
    const { shortName, name, level } = comic;
    return { shortName, name, level, comicpages };
  }
  throw new Error("Comic does not exist");
};

const getAllComics = async () => {
  const comics = await ComicModel.find();
  return comics.map(({ shortName, name, level }) => ({
    shortName,
    name,
    level,
  }));
};

export default {
  getIndexByKey,
  getPagesByIndex,
  getPagesByKey,
  changeLastPage,

  getOnePage,
  returnKeyByAnswer,
  getPagesToReturn,
  getComic,
  getAllComics,
};
