import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import handler from "../api/search.js";

function mockResponse() {
  return {
    code: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

const ORIGINAL_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const ORIGINAL_GET = axios.get;

function restore() {
  if (ORIGINAL_ACCESS_KEY === undefined) delete process.env.UNSPLASH_ACCESS_KEY;
  else process.env.UNSPLASH_ACCESS_KEY = ORIGINAL_ACCESS_KEY;
  axios.get = ORIGINAL_GET;
}

test("search API returns 405 for non-GET methods", async () => {
  try {
    const res = mockResponse();
    process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
    await handler({ method: "POST", query: {} }, res);
    assert.equal(res.code, 405);
    assert.equal(res.headers.Allow, "GET");
  } finally {
    restore();
  }
});

test("search API requires a server-side access key", async () => {
  try {
    const res = mockResponse();
    delete process.env.UNSPLASH_ACCESS_KEY;
    await handler({ method: "GET", query: { query: "nature" } }, res);
    assert.equal(res.code, 503);
  } finally {
    restore();
  }
});

test("search API validates the page number and query", async () => {
  try {
    process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
    for (const query of [
      { query: "" },
      { query: "nature", page: "0" },
      { query: "nature", page: "1.5" },
    ]) {
      const res = mockResponse();
      await handler({ method: "GET", query }, res);
      assert.equal(res.code, 400);
    }
  } finally {
    restore();
  }
});

test("search API uses Axios and safely returns paginated data", async () => {
  try {
    process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
    axios.get = async (url, options) => {
      assert.equal(url, "https://api.unsplash.com/search/photos");
      assert.equal(options.headers.Authorization, "Client-ID test-access-key");
      assert.equal(options.params.query, "mountain lake");
      assert.equal(options.params.page, 2);
      assert.equal(options.params.per_page, 12);
      return { data: { results: [{ id: "photo-1" }], total_pages: 4 } };
    };
    const res = mockResponse();
    await handler({ method: "GET", query: { query: "mountain lake", page: "2" } }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.results[0].id, "photo-1");
    assert.equal(res.body.total_pages, 4);
    assert.equal(JSON.stringify(res.body).includes("test-access-key"), false);
  } finally {
    restore();
  }
});

test("search API propagates upstream 429 status", async () => {
  try {
    process.env.UNSPLASH_ACCESS_KEY = "test-access-key";
    axios.get = async () => {
      throw { response: { status: 429 } };
    };
    const res = mockResponse();
    await handler({ method: "GET", query: { query: "sea" } }, res);
    assert.equal(res.code, 429);
  } finally {
    restore();
  }
});
