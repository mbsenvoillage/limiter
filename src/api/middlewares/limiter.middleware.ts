import { NextFunction, Request, Response } from "express";
import config from "../../config";

export default function limiter(limiterFunc: any) {
  return async function limit(req: Request, res: Response, next: NextFunction) {
    let shouldBlock: boolean;
    let hits: number;
    let ttl: number;
    let reqLimit: number;
    try {
      let ip = req.ip;
      let auth = req.headers.authorization;
      let path = req.path;
      let routeWeights = config.limiter.routeWeights;
      let currentRouteWeight =
        routeWeights[path as keyof typeof routeWeights] || 1;
      let key = auth ? auth.split(" ")[1] : ip;
      [shouldBlock, hits, ttl, reqLimit] = await limiterFunc(
        key,
        currentRouteWeight
      );

      if (shouldBlock) {
        return res.status(429).json({
          error: `You have made ${hits} request but your account is currently limited at ${reqLimit} requests. You can make a request in ${ttl} s`,
        });
      }
    } catch (e) {
      next(e);
    }
    next();
  };
}
