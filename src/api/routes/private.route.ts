import { Router, Request, Response, NextFunction } from "express";

let route = Router();

export default (
  app: Router,
  isAuthenticated: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>,
  limiter: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | undefined>
) => {
  route.get("/private1", (req: Request, res: Response) => {
    return res.json({
      message: "OK from private 1",
    });
  });

  route.get("/private2", (req: Request, res: Response) => {
    return res.json({ message: "OK from private 2" });
  });

  app.use("/private", isAuthenticated, limiter, route);
};
