import config from "../config";
import express, { Router, Request, Response, NextFunction } from "express";
import privateRoutes from "./routes/private.route";
import publicRoutes from "./routes/public.route";
import authRoute from "./routes/auth.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import limiter from "./middlewares/limiter.middleware";
import { RedisClientType } from "redis";

export default (redis: RedisClientType) => {
  const app = Router();

  app.use(express.json());

  app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong");
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
    res.status(err.name == "NotFoundError" ? 404 : 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });

  return app;
};
