import { Application } from "express";
import routes from "../api/index";

export default (app: Application, redis: any) => {
  app.use(routes(redis));
};
