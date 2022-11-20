import { Router, Request, Response } from "express";

let router = Router();

router.get("/public1", (req: Request, res: Response) => {
  return res.json({message: "Ok from p1"});
});

router.get("/public2", (req: Request, res: Response) => {
  return res.json({message: "Ok from p2"});
});

export default router;
