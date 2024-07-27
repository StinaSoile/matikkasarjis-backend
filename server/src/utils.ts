import { Page } from "./types";

export const toStringList = (obj: unknown): string[] => {
  if (!Array.isArray(obj)) {
    throw new Error("not an array");
  }
  const newObj: string[] = [];
  for (let i = 0; i < obj.length; i++) {
    newObj[i] = parseString(obj[i]);
  }
  return newObj;
};

export const stringToNumber = (string: string): number => {
  const nmb = Number(string);
  if (isNaN(nmb)) throw new Error(`${string} is not a number`);
  return nmb;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (string: unknown): string => {
  if (!string || !isString(string)) {
    throw new Error("Can parse to string");
  }

  return string;
};

const returnPageByIndex = (page: number, comic: Page[]) => {
  if (page < comic.length) return comic[page];
  throw new Error("Page does not exist");
};

export const checkIfRightAnswer = (
  comic: Page[],
  pageIndex: number,
  answers: string[]
): boolean => {
  const page = returnPageByIndex(pageIndex, comic);
  if (!page || !page.questionList) return false;
  if (page.questionList.length !== answers.length) return false;
  let rightAnswer = true;
  for (let i = 0; i < page.questionList.length; i++) {
    if (answers[i] != page.questionList[i].answer) {
      rightAnswer = false;
    }
  }
  return rightAnswer;
};

export const findNextKey = (comic: Page[], page: number): string => {
  for (let i = page + 1; i < comic.length; i++) {
    if (comic[i].key) {
      return comic[i].key as string; // tässä on oikaistu typescriptin suhteen, ehkä korjaa myöhemmin
    }
  }
  throw new Error("No keys found");
};

export const findCurrentKey = (comic: Page[], page: number) => {
  const i = page;
  if (comic[i].key) return comic[i].key;
  else throw new Error("No current key found");
};

export const isFirstPage = (page: number) => {
  if (page === 0) return true;
  return false;
};
