import { Router, Request, Response, NextFunction } from "express";

let route = Router();

export default (
  app: Router,
  limiter: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response>
) => {
  route.get("/public1", (req: Request, res: Response) => {
    return res.json({ message: "Ok from p1" }).status(200);
  });

  route.get("/public2", (req: Request, res: Response) => {
    return res.json({ message: "Ok from p2" });
  });

  route.get("/public3", (req: Request, res: Response) => {
    return res.json({ message: "Ok from p3" });
  });

  app.use("/public", limiter, route);
};
