import { Router, Request, Response } from "express";

let router = Router();

router.get("/public1", (req: Request, res: Response) => {
  return res.json({ message: "Ok from p1" }).status(200);
});

router.get("/public2", (req: Request, res: Response) => {
  return res.json({ message: "Ok from p2" });
});

router.get("/public3", (req: Request, res: Response) => {
  return res.json({ message: "Ok from p3" });
});

export default router;
