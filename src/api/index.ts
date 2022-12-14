import config from "../config";
import {
  Router,
  Request,
  Response,
  NextFunction,
  json,
  RequestHandler,
} from "express";
import privateRoutes from "./routes/private.route";
import publicRoutes from "./routes/public.route";
import authRoute from "./routes/auth.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import limiter from "./middlewares/limiter.middleware";
import { RedisClientType } from "redis";

export default (redis: RedisClientType) => {
  const app = Router();

  app.use(json() as RequestHandler);

  app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong");
  });

  app.get("/resetlimit", async (req: Request, res: Response) => {
    let ip = req.ip;
    let auth = req.headers.authorization;
    let redisKey = auth ? auth.split(" ")[1] : ip;
    await redis.del(redisKey);
    return res.json({ message: "Limit was reset for: " + redisKey });
  });

  authRoute(app);

  privateRoutes(
    app,
    isAuthenticated,
    limiter(config.limiter.timeWindow, config.limiter.public.maxRequests, redis)
  );

  publicRoutes(
    app,
    limiter(config.limiter.timeWindow, config.limiter.public.maxRequests, redis)
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Cannot find what you're looking for");
    err.name = "NotFoundError";
    next(err);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).send({ message: err.message }).end();
    }
    return next(err);
  });
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const status = err.name == "NotFoundError" ? 404 : 500;
    res.status(status);
    console.error(err.message);
    res.json({
      message: status == 500 ? "Internal Server Error" : err.message,
    });
  });

  return app;
};
