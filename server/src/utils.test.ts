import assert from "node:assert";
import test from "node:test";

import {
  toStringList,
  stringToNumber,
  returnPageByIndex,
  checkIfRightAnswer,
  findNextKey,
  findCurrentKey,
  isFirstPage,
} from "./utils";
import { Page } from "./types";

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

test.describe("testing toStringList-function, implicitly parseString and isString", () => {
  test("toStringList, when not array", () => {
    const result = () => toStringList("");
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Not an array");
      return true;
    });
  });

  test("toStringList, when not strings in array", () => {
    const result = () => toStringList([null, true, "lkj"]);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Not able to parse to string");
      return true;
    });
  });

  test("toStringList, when string array", () => {
    const a = ["string1", "string2"];
    const result = toStringList(a);

    assert.deepEqual(a, result);
  });
});
test.describe("testing stringToNumber", () => {
  test("string to number when possible", () => {
    const a = "23";
    const result = stringToNumber(a);

    assert.strictEqual(Number(a), result);
  });

  test("string not number, should throw error", () => {
    const a = "23g";
    const result = () => stringToNumber(a);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, a + ` is not a number`);
      return true;
    });
  });
});

test.describe("testing returnPageByIndex", () => {
  test("when comic is ok and page exists, return page", () => {
    const result = returnPageByIndex(2, SomeComic);

    assert.deepEqual(SomeComic[2], result);
  });

  test("if comic is empty array, should throw error", () => {
    const result = () => returnPageByIndex(4, []);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });

  test("if comic is ok but pagenumber too big, should throw error", () => {
    const result = () => returnPageByIndex(40, SomeComic);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
  test("if comic is ok but pagenumber negative, should throw error", () => {
    const result = () => returnPageByIndex(-2, SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
});

test.describe("testing checkIfRightAnswer", () => {
  test("If page ok, pagenumber ok and answer right, returns true", () => {
    const result = checkIfRightAnswer(SomeComic, 2, ["kyllä"]);
    assert.strictEqual(result, true);
  });

  test("If page ok, pagenumber ok and answer wrong, returns false", () => {
    const result = checkIfRightAnswer(SomeComic, 2, ["juu", "ei"]);
    assert.strictEqual(result, false);

    const result2 = checkIfRightAnswer(SomeComic, 2, []);
    assert.strictEqual(result2, false);
  });

  test("if page does not exist (pagenumber too big), throws error from returnPageByIndex", () => {
    const result = () => checkIfRightAnswer(SomeComic, 20, ["juu"]);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
});

test.describe("testing findNextKey", () => {
  test("comic and pagenumber ok, key found", () => {
    const result = findNextKey(SomeComic, 2);
    assert.deepEqual(result, "key2");
  });

  test("pagenumber too big to find key but valid page, specific error", () => {
    const result = () => findNextKey(SomeComic, 5);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No keys found");
      return true;
    });
  });

  test("pagenumber invalid, error", () => {
    const result = () => findNextKey(SomeComic, -2);
    assert.throws(result, Error);
  });

  test("comic empty, specific error", () => {
    const result = () => findNextKey([], 2);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No keys found");
      return true;
    });
  });
});

test.describe("testing findCurrentKey", () => {
  test("comic and pagenumber ok, key found", () => {
    const result = findCurrentKey(SomeComic, 2);
    assert.deepEqual(result, "key1");
  });

  test("no key in given page, throws specific error", () => {
    const result = () => findCurrentKey(SomeComic, 1);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No current key found");
      return true;
    });
  });

  test("pagenumber too big, error", () => {
    const result = () => findCurrentKey(SomeComic, 8);
    assert.throws(result, Error);
  });

  test("comic empty, error", () => {
    const result = () => findCurrentKey([], 2);
    assert.throws(result, Error);
  });
});
test.describe("testing isFirstPage", () => {
  test("not first page, return false", () => {
    const result = isFirstPage(2);
    assert.strictEqual(result, false);
  });

  test("first page, return true", () => {
    const result = isFirstPage(0);
    assert.strictEqual(result, true);
  });
});
