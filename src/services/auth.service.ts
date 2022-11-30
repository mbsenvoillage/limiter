import jwt from "jsonwebtoken";
export default class AuthenticationService {
  public makeToken(): string {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: "id",
      },
      "secret"
    );
  }

  public limitRequests(timeFrame: number, reqLimit: number, redis: any) {
    return async function limit(key: any, routeWeight: number): Promise<any> {
      if (!redis || !reqLimit || !timeFrame) {
        let e = new Error("Limiter arguments must all be truthy");
        throw e;
      }

      let ttl: number;
      let hits: number;

      const keyExists = await redis.exists(key);
      hits = await redis.incrBy(key, routeWeight);
      if (!keyExists) {
        await redis.expire(key, timeFrame);
        ttl = timeFrame;
      } else {
        ttl = await redis.ttl(key);
      }

      if (hits > reqLimit) {
        return [true, hits, ttl, reqLimit];
      }
      return [false, hits, ttl, reqLimit];
    };
  }
}
