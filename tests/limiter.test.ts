import AuthenticationService from "../src/services/auth.service";

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

let authService = new AuthenticationService();
let key = "ip";
let routeWeight = 1;

describe("/api/middlewares/limiter", () => {
  describe("fails", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should throw error if limiter args are missing", async () => {
      // @ts-ignore
      let limit = authService.limitRequests(null, null, null);

      await expect(limit(key, routeWeight)).rejects.toThrow(
        new Error("Limiter arguments must all be truthy")
      );
    });
  });

  describe("succeeds", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return false if hits < reqLimit ", async () => {
      let limit = authService.limitRequests(10, 10, redis);

      let [shouldBlock, ...rest] = await limit(key, routeWeight);
      expect(shouldBlock).toBe(false);
    });
    it("should return true if hits > reqLimit", async () => {
      let limit = authService.limitRequests(10, 1, redis);
      let [shouldBlock, ...rest] = await limit(key, routeWeight);
      await expect(shouldBlock).toBe(true);
    });
  });
});
