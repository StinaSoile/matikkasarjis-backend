import assert from "node:assert";
import { test } from "node:test";
import comicService from "./comicService";

import { Page, PageWithNoAnswer } from "../types";
import { VelhonTaloudenhoitajaTypedPages } from "../../data/comicData";

const ComicPages: Page[] = [
  {
    pictureName: "etusivu.png",
  },
  {
    pictureName: "s1.png",
  },
  {
    key: "key1",
    pictureName: "s2.png",
    questionList: [
      {
        question: "Onko?",
        answer: "kyllä",
      },
    ],
  },
  {
    pictureName: "s3.png",
  },
  {
    key: "key2",
    pictureName: "s2.png",
    questionList: [
      {
        question: "Eikö ole?",
        answer: "ei",
      },
    ],
  },
  {
    key: "key3",
    pictureName: "s2.png",
  },
];
const ComicPagesnoAnswer: (PageWithNoAnswer | Page)[] = [
  {
    pictureName: "etusivu.png",
  },
  {
    pictureName: "s1.png",
  },
  {
    key: "key1",
    pictureName: "s2.png",
    questionList: [
      {
        question: "Onko?",
        answer: "kyllä",
      },
    ],
  },
  {
    pictureName: "s3.png",
  },
  {
    key: "key2",
    pictureName: "s2.png",
    questionList: [
      {
        question: "Eikö ole?",
      },
    ],
  },
];

test.describe("testing getIndexByKey", () => {
  test("should return index if key is valid and page exists", () => {
    const result = comicService.getIndexByKey("key3", ComicPages);
    assert.strictEqual(result, 5);
  });
  test("should return -1 if key is invalid", () => {
    const result = comicService.getIndexByKey("invalidkey", ComicPages);
    assert.strictEqual(result, -1);
  });
  test("should return -1 if comic is empty array", () => {
    const result = comicService.getIndexByKey("key3", []);
    assert.strictEqual(result, -1);
  });
});

test.describe("testing getPagesByIndex", () => {
  test("should return array of pages if page number is inside of bounds", () => {
    const result = comicService.getPagesByIndex(1, ComicPages);
    assert.deepEqual(result, [
      {
        pictureName: "etusivu.png",
      },
      {
        pictureName: "s1.png",
      },
    ]);
  });

  test("should throw error if index is too big", () => {
    const result = () => comicService.getPagesByIndex(19, ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });

  test("should throw error if index is negative", () => {
    const result = () => comicService.getPagesByIndex(-6, ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
});

test.describe("testing getPagesByKey", () => {
  test("should return pages from 0 to page with the given key", () => {
    const result = comicService.getPagesByKey("key1", ComicPages);
    assert.deepEqual(result, [
      {
        pictureName: "etusivu.png",
      },
      {
        pictureName: "s1.png",
      },
      {
        key: "key1",
        pictureName: "s2.png",
        questionList: [
          {
            question: "Onko?",
            answer: "kyllä",
          },
        ],
      },
    ]);
  });

  test("should throw error if key is invalid ", () => {
    const result = () => comicService.getPagesByKey("invalidkey", ComicPages);
    assert.throws(result, Error);
  });

  test("should throw error if comic is empty array", () => {
    const result = () => comicService.getPagesByKey("key1", []);
    assert.throws(result, Error);
  });
});

test.describe("testing getOnePage", () => {
  test("should return page if pagenumber and comic ok", () => {
    const result = comicService.getOnePage("1", ComicPages);
    assert.deepEqual(result, {
      pictureName: "s1.png",
    });
  });

  test("should return page normally even if it is a PageWithNoAnswer", () => {
    const result = comicService.getOnePage("4", ComicPagesnoAnswer);
    assert.deepEqual(result, {
      key: "key2",
      pictureName: "s2.png",
      questionList: [
        {
          question: "Eikö ole?",
        },
      ],
    });
  });
  test("should throw error when pagenumber negative", () => {
    const result = () => comicService.getOnePage("-1", ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
  test("should throw error when pagenumber too big", () => {
    const result = () => comicService.getOnePage("41", ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
});

test.describe("testing returnKeyByAnswer", () => {
  test("should return key if valid body, right answer, page and comic ok", () => {
    const body = ["kyllä"];
    const result = comicService.returnKeyByAnswer(body, "2", ComicPages);
    assert.deepEqual(result, "key2");
  });
  test("should return current key if body has a wrong answer", () => {
    const body = ["väärä vastaus"];
    const result = comicService.returnKeyByAnswer(body, "2", ComicPages);
    assert.deepEqual(result, "key1");
  });

  test("should return current key if body has wrong amount of (right) answers", () => {
    const body = ["kyllä", "kyllä"];
    const result = comicService.returnKeyByAnswer(body, "2", ComicPages);
    assert.deepEqual(result, "key1");
  });

  test("should throw error if body is not string[]", () => {
    const body = "kyllä";
    const result = () => comicService.returnKeyByAnswer(body, "2", ComicPages);
    assert.throws(result, Error);
  });
  test("should throw error if comic is empty array", () => {
    const body = ["kyllä"];
    const result = () => comicService.returnKeyByAnswer(body, "2", []);
    assert.throws(result, Error);
  });
  test("should throw error if page index out of bounds", () => {
    const body = ["kyllä"];
    const result = () => comicService.returnKeyByAnswer(body, "32", ComicPages);
    assert.throws(result, Error);
  });
});

test.describe("testing changeLastPage", () => {
  test("should return comic with changed last page if last page of comic has a questionlist", () => {
    const result = comicService.changeLastPage(
      ComicPages.slice(0, ComicPages.length - 1)
    );
    assert.deepEqual(result, ComicPagesnoAnswer);
  });
  test("should return comic without change if there is no questionlist in the last page", () => {
    const result = comicService.changeLastPage(ComicPages);
    assert.deepEqual(result, ComicPages);
  });
  test("should return original comic if comic is empty array", () => {
    const result = () => comicService.changeLastPage([]);
    assert.throws(result, Error);
  });
});

test.describe("testing getPagesToReturn", () => {
  test("should return pages until given key, the last page changed", () => {
    const result = comicService.getPagesToReturn("key1", ComicPages);
    assert.deepEqual(result, [
      {
        pictureName: "etusivu.png",
      },
      {
        pictureName: "s1.png",
      },
      {
        key: "key1",
        pictureName: "s2.png",
        questionList: [
          {
            question: "Onko?",
          },
        ],
      },
    ]);
  });

  test("should throw specific error if key is wrong", () => {
    const result = () => comicService.getPagesToReturn("wrongkey", ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "There is no page with this key");
      return true;
    });
  });

  test("should throw error if key is not given", () => {
    const result = () => comicService.getPagesToReturn(undefined, ComicPages);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Key is required");
      return true;
    });
  });
});

test.describe("testing getComic", () => {
  test("should give info of one comic, if comic name exists", () => {
    const result = comicService.getComic("velhontaloudenhoitaja");
    assert.deepEqual(result, {
      shortName: "velhontaloudenhoitaja",
      name: "Velhon taloudenhoitaja",
      level: "8. luokka",
      comicpages: VelhonTaloudenhoitajaTypedPages,
    });
  });

  test("should throw error if comic does not exist", () => {
    const result = () => comicService.getComic("eisarjakuva");
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Comic does not exist");
      return true;
    });
  });
});

/* test.describe("testing getAllComics" is in comics.test.ts
 for it to work: uses database and that can be done only in that specific file for now. */
