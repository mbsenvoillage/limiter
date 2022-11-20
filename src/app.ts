import express, { Application, NextFunction, Request, Response } from "express";
import AuthenticationService from "./services/auth.service";
import isAuthenticated from "./api/middlewares/isAuthenticated";
import pub from "./api/routes/public";
import pri from "./api/routes/private";

const app: Application = express();

const port: number = 3001;

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong");
});

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

app.use("/public",(req, res) => {
  console.log("This is only applied to public routes. Which should all fail");
  return res.sendStatus(500);
}, pub);

app.use("/private", isAuthenticated, pri);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
