import limiter from "../src/api/middlewares/limiter.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Response } from "express";

const redis = {
  // @ts-ignore
  exists: async (key) => {
    return Promise.resolve(false);
  },
  // @ts-ignore
  incrBy: async (key, num) => {
    return Promise.resolve(2);
  },
  // @ts-ignore
  expire: async (key, time) => {
    return Promise.resolve();
  },
  // @ts-ignore
  ttl: async (key) => {
    return Promise.resolve(10);
  },
};

describe("/api/middlewares/limiter", () => {
  describe("fails", () => {
    const req = getMockReq();
    const { res, next } = getMockRes();
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should call next() with error if limiter args are missing", async () => {
      // @ts-ignore
      let limit = limiter(null, null, null);
      await limit(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        new Error("Limiter arguments must all be truthy")
      );
    });
  });

  describe("succeeds", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should call next() with no args if hits < reqLimit ", async () => {
      let req = getMockReq({ ip: "12", path: "/public1" });
      let { res, next } = getMockRes();
      let limit = limiter(10, 10, redis);
      await limit(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("should return a res with status 429 if hits > reqLimit", async () => {
      let req = getMockReq({ ip: "12", path: "/public1" });
      let { res, next } = getMockRes({ statusCode: 429 });
      let limit = limiter(10, 1, redis);
      await expect(limit(req, res, next)).resolves.toMatchObject(res);
    });
  });
});
