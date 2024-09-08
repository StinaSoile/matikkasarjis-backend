import supertest from "supertest";
import test from "node:test";
import { app } from "../app";
import assert from "node:assert";

const api = supertest(app);

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
