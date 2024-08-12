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
  test("should return error when not given an array", () => {
    const result = () => toStringList("");
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Not an array");
      return true;
    });
  });

  test("should return error when array includes something else than strings", () => {
    const result = () => toStringList([null, true, "lkj"]);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Not able to parse to string");
      return true;
    });
  });

  test("should return same array of strings as the array given as parameter", () => {
    const a = ["string1", "string2"];
    const result = toStringList(a);

    assert.deepEqual(a, result);
  });
});
test.describe("testing stringToNumber", () => {
  test("should return number when given string that is convertable to number", () => {
    const a = "23";
    const result = stringToNumber(a);

    assert.strictEqual(Number(a), result);
  });

  test("should throw error when string cant be changed to number", () => {
    const a = "23g";
    const result = () => stringToNumber(a);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, a + ` is not a number`);
      return true;
    });
  });
});

test.describe("testing returnPageByIndex", () => {
  test("should return page, given comic (Page[]) and index", () => {
    const result = returnPageByIndex(2, SomeComic);

    assert.deepEqual(SomeComic[2], result);
  });

  test("should throw error if comic is empty array", () => {
    const result = () => returnPageByIndex(4, []);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });

  test("should throw error when index is too big", () => {
    const result = () => returnPageByIndex(40, SomeComic);

    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
  test("should throw error when index is negative", () => {
    const result = () => returnPageByIndex(-2, SomeComic);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
});

test.describe("testing checkIfRightAnswer", () => {
  test("should return true when answer right", () => {
    const result = checkIfRightAnswer(SomeComic, 2, ["kyllä"]);
    assert.strictEqual(result, true);
  });

  test("should return false when answer false", () => {
    const result = checkIfRightAnswer(SomeComic, 2, ["juu", "ei"]);
    assert.strictEqual(result, false);

    const result2 = checkIfRightAnswer(SomeComic, 2, []);
    assert.strictEqual(result2, false);
  });

  test("should throw error if pagenumber too big", () => {
    const result = () => checkIfRightAnswer(SomeComic, 20, ["juu"]);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });

  test("should throw error if comic is empty array", () => {
    const result = () => checkIfRightAnswer([], 2, ["juu", "ei"]);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "Page does not exist");
      return true;
    });
  });
});

test.describe("testing findNextKey", () => {
  test("should return next key if comic and pagenumber valid", () => {
    const result = findNextKey(SomeComic, 2);
    assert.deepEqual(result, "key2");
  });

  test("should throw error if pagenumber in bounds but too big to find key", () => {
    const result = () => findNextKey(SomeComic, 5);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No keys found");
      return true;
    });
  });

  test("should throw error if pagenumber out of bounds", () => {
    const result = () => findNextKey(SomeComic, -2);
    assert.throws(result, Error);
  });

  test("should throw error if comic empty", () => {
    const result = () => findNextKey([], 2);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No keys found");
      return true;
    });
  });
});

test.describe("testing findCurrentKey", () => {
  test("should return key in given page if comic and pagenumber ok", () => {
    const result = findCurrentKey(SomeComic, 2);
    assert.deepEqual(result, "key1");
  });

  test("should throw specific error if given page has no key", () => {
    const result = () => findCurrentKey(SomeComic, 1);
    assert.throws(result, (err: Error) => {
      assert.strictEqual(err.message, "No current key found");
      return true;
    });
  });

  test("should throw error if pagenumber too big", () => {
    const result = () => findCurrentKey(SomeComic, 8);
    assert.throws(result, Error);
  });

  test("should throw error if comic is empty array", () => {
    const result = () => findCurrentKey([], 2);
    assert.throws(result, Error);
  });
});
test.describe("testing isFirstPage", () => {
  test("should return false if given pagenumber is not 0", () => {
    const result = isFirstPage(2);
    assert.strictEqual(result, false);
  });

  test("should return true if given pagenumber 0", () => {
    const result = isFirstPage(0);
    assert.strictEqual(result, true);
  });
});
