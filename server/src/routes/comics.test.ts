import supertest from "supertest";
import test from "node:test";
import { app } from "../app";
import assert from "node:assert";
import { Page } from "../types";

const api = supertest(app);

test.describe("testing get(`api/comics/siivetonlepakko`)", () => {
  test("comic pages are returned as json", async () => {
    await api
      .get("/api/comics/siivetonlepakko?key=eka")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return list of pages until page with given key", async () => {
    const result = await api.get("/api/comics/siivetonlepakko?key=eka");

    assert.deepEqual(result.body, [
      {
        pictureName: "varsinainen-etusivu.png",
      },
      {
        pictureName: "lepakko-s1.png",
      },
      {
        key: "eka",
        pictureName: "lepakko-s2.png",
        questionList: [
          {
            question: "Montako ötököitä on yhteensä?",
          },
        ],
      },
    ]);
  });

  test("should have same key in the last page as the query parameter", async () => {
    const result = await api.get("/api/comics/siivetonlepakko?key=eka");
    const lastIndex = result.body.length - 1;
    const returnedKey = result.body[lastIndex].key as string | undefined;
    assert.deepEqual(returnedKey, "eka");

    const result2 = await api.get("/api/comics/siivetonlepakko?key=1332");
    const lastIndex2 = result2.body.length - 1;
    const returnedKey2 = result2.body[lastIndex2].key as string | undefined;
    assert.deepEqual(returnedKey2, "1332");
  });

  test("should not have answers in the questionList of the last page", async () => {
    const result = await api.get("/api/comics/siivetonlepakko?key=eka");
    const lastItem = result.body[result.body.length - 1] as Page;
    if (lastItem.questionList) {
      lastItem.questionList.forEach((question) => {
        assert.strictEqual(question["answer"], undefined);
      });
    }
  });

  test("should throw error if key is wrong", async () => {
    const result = await api
      .get("/api/comics/siivetonlepakko?key=huonoavain")
      .expect(400);

    assert.strictEqual(result.text, "There is no page with this key");
  });

  test("should throw error if key is not given as query parameter", async () => {
    const result = await api.get("/api/comics/siivetonlepakko").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });
});

test.describe("testing post(`api/comics/siivetonlepakko/:page`)", () => {
  test("should return next key if answer in the body is right", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/4")
      .send(["13", "32"])
      .expect(200);

    assert.deepEqual(result.body, "1332");
  });

  test("should return current key if answer is wrong", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/4")
      .send(["13", "42"])
      .expect(200);

    assert.deepEqual(result.body, "key124");
  });

  test("should throw error with status 400 if body does not exist", async () => {
    const response = await api
      .post("/api/comics/siivetonlepakko/4")
      .expect(400);

    assert.deepEqual(response.text, "Not an array");
  });

  test("should return first key if there is no body but address has a first page /0", async () => {
    const result = await api.post("/api/comics/siivetonlepakko/0").expect(200);

    assert.deepEqual(result.body, "eka");
  });

  test("should return first key if answer is wrong but address has a first page /0", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/0")
      .send(["13", "32"])
      .expect(200);

    assert.deepEqual(result.body, "eka");
  });

  test("should throw error if page in address does not exist", async () => {
    await api
      .post("/api/comics/siivetonlepakko/50")
      .send(["13", "32"])
      .expect(400);
  });
});

test.describe("testing get(`api/comics/siivetonlepakko/:page`)", () => {
  test("should return right page", async () => {
    const result = await api
      .get("/api/comics/siivetonlepakko/2?key=eka")
      .expect(200);

    assert.deepEqual(result.body, {
      key: "eka",
      pictureName: "lepakko-s2.png",
      questionList: [
        {
          question: "Montako ötököitä on yhteensä?",
        },
      ],
    });
  });

  test("should throw error if key is not given in query", async () => {
    const result = await api.get("/api/comics/siivetonlepakko/2").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });

  test("should throw error if key is for earlier pages", async () => {
    const result = await api
      .get("/api/comics/siivetonlepakko/5?key=eka")
      .expect(400);

    assert.strictEqual(result.text, "Index out of bounds");
  });
});
