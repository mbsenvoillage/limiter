import { Router, Request, Response } from "express";

let router = Router();

router.get("/private1", (req: Request, res: Response) => {
  return res.json({ message: "OK from private 1" });
});

router.get("/private2", (req: Request, res: Response) => {
  return res.json({ message: "OK from private 2" });
});

export default router;
