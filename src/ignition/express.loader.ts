import { Application } from "express";
import routes from "../api/index";
import AuthenticationService from "../services/auth.service";

export default (app: Application, redis: any) => {
  let authService = new AuthenticationService();
  app.use(routes(redis, authService));
};
