import { Router, Request, Response, NextFunction } from "express";
import AuthenticationService from "../../services/auth.service";

export default (app: Router) => {
  app.get("/tokengen", (req: Request, res: Response, next: NextFunction) => {
    try {
      let authService = new AuthenticationService();
      const token = authService.makeToken();
      return res.json({ token }).status(200);
    } catch (e) {
      console.error("Error: %o", e);
      return next(e);
    }
  });
};
