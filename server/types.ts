export interface Page {
  key?: string;
  pictureName: string;
  questionList?: Question[];
}

export interface Question {
  question: string;
  answer: string;
}

export interface PageWithNoAnswer {
  key?: string;
  pictureName: string;
  questionList?: QuestionWithNoAnswer[];
}

export interface Comic {
  shortName: string;
  name: string;
  level: string;
  comicpages: Page[];
}

export interface User {
  username: string;
  password: string;
  progress: ProgressItem[];
}

export interface ProgressItem {
  comic: string;
  key: string;
}
export type ComicWithNoPages = Omit<Comic, "comicpages">;

export type QuestionWithNoAnswer = Omit<Question, "answer">;
