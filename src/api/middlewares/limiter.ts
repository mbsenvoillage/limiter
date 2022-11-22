import { NextFunction, Request, Response } from "express";
import config from "../../config/index";

export default function limiter(
  timeFrame: number,
  reqLimit: number,
  redis: any
) {
  return async function limit(req: Request, res: Response, next: NextFunction) {
    let ttl: number;
    let hits: number;
    let ip = req.ip;
    let auth = req.headers.authorization;
    let path = req.path;
    let routeWeights = config.limiter.routeWeights;
    let currentRouteWeight = routeWeights[path as keyof typeof routeWeights];
    let key = auth ? auth.split(" ")[1] : ip;

    const keyExists = await redis.exists(key);

    if (!keyExists) {
      hits = await redis.incrBy(key, currentRouteWeight);
      await redis.expire(key, timeFrame);
      ttl = timeFrame;
    } else {
      hits = await redis.incrBy(key, currentRouteWeight);
      ttl = await redis.ttl(key);
    }

    if (hits > reqLimit) {
      return res.status(429).json({
        error: `You have made ${hits} request but your account is currently limited at ${reqLimit} requests. You can make a request in ${ttl} s`,
      });
    }
    next();
  };
}
