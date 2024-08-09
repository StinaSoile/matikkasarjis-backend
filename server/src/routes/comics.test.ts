import supertest from "supertest";
import test, { after } from "node:test";
import { app, server } from "../index";
import assert from "node:assert";
import { Page, } from "../types";

const api = supertest(app);

test.describe("testing get(`api/comics/siivetonlepakko`), that gives comicpages when given key in query", () => {
  test("comic pages are returned as json", async () => {
    await api
      .get("/api/comics/siivetonlepakko?key=eka")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("result is (Page | PageWithNoAnswers)[]", async () => {
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

  test("key of last page is the same key as in query", async () => {
    const result = await api.get("/api/comics/siivetonlepakko?key=eka");
    const lastIndex = result.body.length - 1;
    const returnedKey = result.body[lastIndex].key as string | undefined;
    assert.deepEqual(returnedKey, "eka");

    const result2 = await api.get("/api/comics/siivetonlepakko?key=1332");
    const lastIndex2 = result2.body.length - 1;
    const returnedKey2 = result2.body[lastIndex2].key as string | undefined;
    assert.deepEqual(returnedKey2, "1332");
  });

  test("last page questionList should be without answers", async () => {
    const result = await api.get("/api/comics/siivetonlepakko?key=eka");
    const lastItem = result.body[result.body.length - 1] as Page;
    if (lastItem.questionList) {
      lastItem.questionList.forEach(
        (question) => {
          assert.strictEqual(question["answer"], undefined);
        }
      );
    }
  });

  test("error if key is wrong", async () => {
    const result = await api
      .get("/api/comics/siivetonlepakko?key=huonoavain")
      .expect(400);

    assert.strictEqual(result.text, "There is no page with this key");
  });

  test("error if no key", async () => {
    const result = await api.get("/api/comics/siivetonlepakko").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });
});

test.describe("testing post(`api/comics/siivetonlepakko/:page`), that gives key if body has right answer", () => {
  test("right answer, gives next key", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/4")
      .send(["13", "32"])
      .expect(200);

    assert.deepEqual(result.body, "1332");
  });

  test("wrong answer, gives current key", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/4")
      .send(["13", "42"])
      .expect(200);

    assert.deepEqual(result.body, "key124");
  });

  test("no answer, throws specific error with status 400", async () => {
    const response = await api
      .post("/api/comics/siivetonlepakko/4")
      .expect(400);

    assert.deepEqual(response.text, "Not an array");
  });

  test("no answer but first page, gives first key", async () => {
    const result = await api.post("/api/comics/siivetonlepakko/0").expect(200);

    assert.deepEqual(result.body, "eka");
  });

  test("wrong answer but first page, gives first key", async () => {
    const result = await api
      .post("/api/comics/siivetonlepakko/0")
      .send(["13", "32"])
      .expect(200);

    assert.deepEqual(result.body, "eka");
  });

  test("page does not exist, throws error", async () => {
    await api
      .post("/api/comics/siivetonlepakko/50")
      .send(["13", "32"])
      .expect(400);
  });
});

test.describe("testing get(`api/comics/siivetonlepakko/:page`)", () => {
  test("result is right page and type Page | PageWithNoResults", async () => {
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

  test("if no key, throws specific error", async () => {
    const result = await api.get("/api/comics/siivetonlepakko/2").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });

  test("if key is for earlier pages, throws specific error", async () => {
    const result = await api
      .get("/api/comics/siivetonlepakko/5?key=eka")
      .expect(400);

    assert.strictEqual(result.text, "Index out of bounds");
  });
});

after(() => {
  server.close(() => {
    console.log("Server closed");
  });
});
