export interface Page {
  key?: string;
  pictureName: string;
  questionList?: Question[];
}

export interface Question {
  question: string;
  answer: string;
}
