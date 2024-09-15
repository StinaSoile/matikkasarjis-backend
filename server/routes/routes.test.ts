import supertest from "supertest";
import { test, beforeEach, before, after } from "node:test";
import { app } from "../app";
import assert from "node:assert";
import { Page, PageWithNoAnswer } from "../types";
import mongoose from "mongoose";
import Comic from "../models/comic";
import comicService from "../services/comicService";
import User from "../models/user";
import bcrypt from "bcrypt";

const api = supertest(app);

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

const SomeComic = {
  shortName: "somecomic",
  name: "Some Comic",
  level: "some level",
  comicpages: ComicPages,
};
const PageWithNoAnswerComic = {
  shortName: "pagewithnoanswercomic",
  name: "Some Comic with a page without answer",
  level: "some level",
  comicpages: ComicPagesnoAnswer,
};
const url = process.env.TEST_MONGODB_URI as string;

before(async () => {
  await mongoose
    .connect(url)
    .then((_result) => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error.message);
    });
});

beforeEach(async () => {
  await Comic.deleteMany({});
  await Comic.insertMany([SomeComic, PageWithNoAnswerComic]);
});

after(async () => {
  await mongoose.connection.close();
});

test.describe("testing get(`api/comics/:comicName`)", () => {
  test("comic pages are returned as json", async () => {
    await api
      .get("/api/comics/somecomic?key=key1")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return list of pages until page with given key", async () => {
    const result = await api.get("/api/comics/somecomic?key=key1");

    assert.deepEqual(result.body, [
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

  test("should have same key in the last page as the query parameter", async () => {
    const result = await api.get("/api/comics/somecomic?key=key1");
    const lastIndex = result.body.length - 1;
    const returnedKey = result.body[lastIndex].key as string | undefined;
    assert.deepEqual(returnedKey, "key1");

    const result2 = await api.get("/api/comics/somecomic?key=key3");
    const lastIndex2 = result2.body.length - 1;
    const returnedKey2 = result2.body[lastIndex2].key as string | undefined;
    assert.deepEqual(returnedKey2, "key3");
  });

  test("should not have answers in the questionList of the last page", async () => {
    const result = await api.get("/api/comics/somecomic?key=key1");
    const lastItem = result.body[result.body.length - 1] as Page;
    if (lastItem.questionList) {
      lastItem.questionList.forEach((question) => {
        assert.strictEqual(question["answer"], undefined);
      });
    }
  });

  test("should throw error if key is wrong", async () => {
    const result = await api
      .get("/api/comics/somecomic?key=huonoavain")
      .expect(400);

    assert.strictEqual(result.text, "There is no page with this key");
  });

  test("should throw error if key is not given as query parameter", async () => {
    const result = await api.get("/api/comics/somecomic").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });

  test("should throw error if comic does not exist", async () => {
    const result = await api.get("/api/comics/eisarjakuva?key=eka").expect(404);

    assert.strictEqual(result.text, "Comic does not exist");
  });
});

test.describe("testing post(`api/comics/:comicName/:page`)", () => {
  test("should return next key if answer in the body is right", async () => {
    const result = await api
      .post("/api/comics/somecomic/2")
      .send(["kyllä"])
      .expect(200);

    assert.deepEqual(result.body, "key2");
  });

  test("should return current key if answer is wrong", async () => {
    const result = await api
      .post("/api/comics/somecomic/4")
      .send(["13", "42"])
      .expect(200);

    assert.deepEqual(result.body, "key2");
  });

  test("should throw error with status 400 if body does not exist", async () => {
    const response = await api.post("/api/comics/somecomic/2").expect(400);

    assert.deepEqual(response.text, "Not an array");
  });

  test("should return first key if there is no body but address has a first page /0", async () => {
    const result = await api.post("/api/comics/somecomic/0").expect(200);

    assert.deepEqual(result.body, "key1");
  });

  test("should return first key if answer is wrong but address has a first page /0", async () => {
    const result = await api
      .post("/api/comics/somecomic/0")
      .send(["13", "32"])
      .expect(200);

    assert.deepEqual(result.body, "key1");
  });

  test("should throw error if page in address does not exist", async () => {
    await api.post("/api/comics/somecomic/50").send(["13", "32"]).expect(400);
  });
  test("should throw error if comic does not exist", async () => {
    const result = await api.post("/api/comics/eisarjakuva/0").expect(404);

    assert.strictEqual(result.text, "Comic does not exist");
  });
});

test.describe("testing get(`api/comics/:comicName/:page`)", () => {
  test("should return right page", async () => {
    const result = await api
      .get("/api/comics/somecomic/2?key=key1")
      .expect(200);

    assert.deepEqual(result.body, {
      key: "key1",
      pictureName: "s2.png",
      questionList: [
        {
          question: "Onko?",
        },
      ],
    });
  });

  test("should throw error if key is not given in query", async () => {
    const result = await api.get("/api/comics/somecomic/2").expect(400);

    assert.strictEqual(result.text, "Key is required");
  });

  test("should throw error if key is for earlier pages", async () => {
    const result = await api
      .get("/api/comics/somecomic/4?key=key1")
      .expect(400);

    assert.strictEqual(result.text, "Index out of bounds");
  });

  test("should throw error if comic does not exist", async () => {
    const result = await api
      .get("/api/comics/eisarjakuva/0?key=eka")
      .expect(404);

    assert.strictEqual(result.text, "Comic does not exist");
  });
});

test.describe("testing get(`api/comics`)", async () => {
  await test("should return list of comics without pages", async () => {
    const result = await api.get("/api/comics").expect(200);

    assert.deepEqual(result.body, [
      {
        shortName: "somecomic",
        name: "Some Comic",
        level: "some level",
      },
      {
        shortName: "pagewithnoanswercomic",
        name: "Some Comic with a page without answer",
        level: "some level",
      },
    ]);
  });
});

test.describe("testing getAllComics", async () => {
  await test("should return list of comics but no pages", async () => {
    const result = await comicService.getAllComics();
    assert.deepEqual(result, [
      {
        shortName: "somecomic",
        name: "Some Comic",
        level: "some level",
      },
      {
        shortName: "pagewithnoanswercomic",
        name: "Some Comic with a page without answer",
        level: "some level",
      },
    ]);
  });
});

test.describe("testing getComic", async () => {
  await test("should give info of one comic, if comic name exists", async () => {
    const result = await comicService.getComic("somecomic");
    assert.deepEqual(result, {
      shortName: "somecomic",
      name: "Some Comic",
      level: "some level",
      comicpages: ComicPages,
    });
  });

  await test("should throw error if comic does not exist", async () => {
    try {
      await comicService.getComic("eisarjakuva");
      assert.fail("Expected error was not thrown");
    } catch (err: unknown) {
      assert(err instanceof Error);
      assert.strictEqual(err.message, "Comic does not exist");
    }
  });
});

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

test.describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash, progress: [] });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "soile",
      password: "salainen",
      progress: [],
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "root",
      password: "salainen2",
      progress: [],
    };

    await api.post("/api/users").send(newUser).expect(400);
    // .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

test.describe("testing get(`api/images/:comicName/:imageName`)", () => {
  test("should return image if it exists in the path", async () => {
    const kuva1 = await api
      .get("/api/images/siivetonlepakko/lepakko-s1.png")
      .expect(200);
    assert.deepEqual(kuva1.headers["content-type"], "image/png");

    const kuva2 = await api
      .get("/api/images/velhontaloudenhoitaja/velhontaloudenhoitaja-s4.png")
      .expect(200);
    assert.deepEqual(kuva2.headers["content-type"], "image/png");
  });

  test("should throw error if path or image name is wrong", async () => {
    const result1 = await api
      .get("/api/images/siivetonrapakko/lepakko-s1.png")
      .expect(404);
    assert.strictEqual(result1.text, "Image not found");

    const result2 = await api
      .get("/api/images/siivetonlepakko/s1.png")
      .expect(404);
    assert.strictEqual(result2.text, "Image not found");
  });
});

test.describe("testing get(`api/images/:imageName`)", () => {
  test("should return image if it exists in the path", async () => {
    const kuva1 = await api.get("/api/images/etusivunkuva.png").expect(200);
    assert.deepEqual(kuva1.headers["content-type"], "image/png");
  });

  test("should throw error if path or image name is wrong", async () => {
    const result1 = await api.get("/api/images/ei").expect(404);
    assert.strictEqual(result1.text, "Image not found");

    const result2 = await api.get("/api/images/s1.png").expect(404);
    assert.strictEqual(result2.text, "Image not found");
  });
});
