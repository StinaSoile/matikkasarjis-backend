import assert from "node:assert";
import test from "node:test";
import comicService from "./comicService";

import { Page, PageWithNoAnswer } from "../types";

const SomeComic: Page[] = [
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
const ComicWithPageWithNoAnswers: (PageWithNoAnswer | Page)[] = [
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
  test("key valid, page exists, returns index", () => {
    const result = comicService.getIndexByKey("key3", SomeComic);
    assert.strictEqual(result, 5);
  });
  test("key invalid, hence page does not exist, returns -1", () => {
    const result = comicService.getIndexByKey("invalidkey", SomeComic);
    assert.strictEqual(result, -1);
  });
  test("no pages, returns -1", () => {
    const result = comicService.getIndexByKey("key3", []);
    assert.strictEqual(result, -1);
  });
});

test.describe("testing getPagesByIndex", () => {
  test("index inside of bounds, comic exists, returns array of pages", () => {
    const result = comicService.getPagesByIndex(1, SomeComic);
    assert.deepEqual(result, [
      {
        pictureName: "etusivu.png",
      },
      {
        pictureName: "s1.png",
      },
    ]);
  });

  test("index too big, throws specific error", () => {
    const result = () => comicService.getPagesByIndex(19, SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });

  test("index negative, throws specific error", () => {
    const result = () => comicService.getPagesByIndex(-6, SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
});

test.describe("testing getPagesByKey", () => {
  test("valid key, returns pages from 0 to page with that key", () => {
    const result = comicService.getPagesByKey("key1", SomeComic);
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

  test("invalid key, throws error ", () => {
    const result = () => comicService.getPagesByKey("invalidkey", SomeComic);
    assert.throws(result, Error);
  });

  test("invalid comic, throws error", () => {
    const result = () => comicService.getPagesByKey("key1", []);
    assert.throws(result, Error);
  });
});

test.describe("testing getOnePage", () => {
  test("pagenumber ok, comic ok, returns page", () => {
    const result = comicService.getOnePage("1", SomeComic);
    assert.deepEqual(result, {
      pictureName: "s1.png",
    });
  });

  test("if page is a PageWithNoAnswer, returns normally", () => {
    const result = comicService.getOnePage("4", ComicWithPageWithNoAnswers);
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
  test("pagenumber negative, throws specific error", () => {
    const result = () => comicService.getOnePage("-1", SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
  test("pagenumber too big, throws specific error", () => {
    const result = () => comicService.getOnePage("41", SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Index out of bounds");
      return true;
    });
  });
});

test.describe("testing returnKeyByAnswer", () => {
  test("valid body, right answer, page and comic ok, returns key", () => {
    const body = ["kyllä"];
    const result = comicService.returnKeyByAnswer(body, "2", SomeComic);
    assert.deepEqual(result, "key2");
  });
  test("valid body, wrong answer, page and comic ok, returns current key", () => {
    const body = ["väärä vastaus"];
    const result = comicService.returnKeyByAnswer(body, "2", SomeComic);
    assert.deepEqual(result, "key1");
  });

  test("valid body, wrong amount of (right) answers, page and comic ok: returns current key", () => {
    const body = ["kyllä", "kyllä"];
    const result = comicService.returnKeyByAnswer(body, "2", SomeComic);
    assert.deepEqual(result, "key1");
  });

  test("invalid body, page and comic ok: throws error", () => {
    const body = "kyllä";
    const result = () => comicService.returnKeyByAnswer(body, "2", SomeComic);
    assert.throws(result, Error);
  });
  test("valid body, page ok, comic empty: throws error", () => {
    const body = ["kyllä"];
    const result = () => comicService.returnKeyByAnswer(body, "2", []);
    assert.throws(result, Error);
  });
  test("valid body, comic ok, page out of bounds: throws error", () => {
    const body = ["kyllä"];
    const result = () => comicService.returnKeyByAnswer(body, "32", SomeComic);
    assert.throws(result, Error);
  });
});

test.describe("testing changeLastPage", () => {
  test("last page of comic has a questionlist: returns comic with changed last page", () => {
    const result = comicService.changeLastPage(
      SomeComic.slice(0, SomeComic.length - 1)
    );
    assert.deepEqual(result, ComicWithPageWithNoAnswers);
  });
  test("no questionlist in the last page: returns original comic", () => {
    const result = comicService.changeLastPage(SomeComic);
    assert.deepEqual(result, SomeComic);
  });
  test("empty array as comic: returns original comic", () => {
    const result = () => comicService.changeLastPage([]);
    assert.throws(result, Error);
  });
});

test.describe("testing getPagesToReturn", () => {
  test("right key, right comic, returns pages until that key, the last one changed", () => {
    const result = comicService.getPagesToReturn("key1", SomeComic);
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

  test("wrong key, throws specific error", () => {
    const result = () => comicService.getPagesToReturn("key123", SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "There is no page with this key");
      return true;
    });
  });

  test("no key, throws specific error", () => {
    const result = () => comicService.getPagesToReturn(undefined, SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Key is required");
      return true;
    });
  });
});
