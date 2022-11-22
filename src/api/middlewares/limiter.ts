import { NextFunction, Request, Response } from "express";

let routeScores = {
  "/public1": 1,
  "/public2": 2,
  "/public3": 5,
  "/private1": 1,
  "/private2": 5,
};

export default function limiter(
  timeFrame: number,
  reqLimit: number,
  redis: any
) {
  return async function limit(req: Request, res: Response, next: NextFunction) {
    let ip = req.ip;
    let auth = req.headers.authorization;
    let path = req.path;
    let weight = routeScores[path as keyof typeof routeScores];
    let key = auth ? auth.split(" ")[1] : ip;

    console.log(key);

    const keyExists = await redis.exists(key);

    let ttl;
    let hits;
    let commands = redis.multi();

    if (!keyExists) {
      [hits] = await commands.incrBy(key, weight).expire(key, timeFrame).exec();
      ttl = timeFrame;
    } else {
      [hits, ttl] = await commands.incrBy(key, weight).ttl(key).exec();
    }

    if (hits > reqLimit) {
      return res.status(429).json({
        error: `You have made ${hits} request but your account is currently limited at ${reqLimit} requests. You can make a request in ${ttl} s`,
      });
    }

    next();
  };
}
