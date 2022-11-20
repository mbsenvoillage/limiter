import { NextFunction, Request, Response } from "express";

export default function limiter(
  timeFrame: number,
  reqLimit: number,
  redis: any
) {
  return async function limit(req: Request, res: Response, next: NextFunction) {
    let ip = req.ip;
    let auth = req.headers.authorization;
    let key = auth ? auth.split(" ")[1] : ip;
    console.log(key);
    const hits = await redis.incr(key);
    let ttl;
    if (hits === 1) {
      await redis.expire(key, timeFrame);
      ttl = timeFrame;
    } else {
      ttl = await redis.ttl(key);
    }

    if (hits > reqLimit) {
      return res.status(429).json({
        error: `You have made ${hits} request but your account is currently limited at ${reqLimit} requests. You can make a request in ${ttl} s`,
      });
    }

    console.log("credit used: " + hits + " ttl: " + ttl);

    next();
  };
}
