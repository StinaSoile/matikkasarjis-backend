import supertest from "supertest";
import test from "node:test";
import { app } from "../app";
// import assert from "node:assert";

const api = supertest(app);

test.describe("testing get(`api/images/:comicName/:imageName`)", () => {
  test("should return image if it exists in the path", async () => {
    await api.get("/api/images/siivetonlepakko/lepakko-s1.png").expect(200);
  });

  //   test("if no key, throws specific error", async () => {
  //     const result = await api.get("/api/comics/siivetonlepakko/2").expect(400);

  //     assert.strictEqual(result.text, "Key is required");
  //   });

  //   test("if key is for earlier pages, throws specific error", async () => {
  //     const result = await api
  //       .get("/api/comics/siivetonlepakko/5?key=eka")
  //       .expect(400);

  //     assert.strictEqual(result.text, "Index out of bounds");
  //   });
});
