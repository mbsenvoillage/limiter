import { Application } from "express";
import expressLoader from "./express.loader";
import redisLoader from "./redis.loader";

export default async (app: Application) => {
  const redis = await redisLoader();
  expressLoader(app, redis);
};
