import express, { Application, NextFunction, Request, Response } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import AuthenticationService from "./services/auth.service";
import isAuthenticated from "./api/middlewares/isAuthenticated";

const app: Application = express();

const port: number = 3001;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Limiter",
      version: "1.0.0",
      description: "A simple limiter",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./src/app.ts"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 * @openapi
 * /ping:
 *  get:
 *     tags:
 *     - Health
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *          description: Service is up
 */
app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong");
});

/**
 * @openapi
 * /tokengen:
 *  get:
 *     tags:
 *     - Auth
 *     description: Returns a jwt
 *     responses:
 *       200:
 *         description: jwt needed to access private routes
 */
app.get("/tokengen", (req: Request, res: Response, next: NextFunction) => {
  try {
    let auth = new AuthenticationService();
    const token = auth.makeToken();
    return res.json({ token }).status(200);
  } catch (e) {
    console.error("Error: %o", e);
    return next(e);
  }
});

/**
 * @openapi
 * /private:
 *  get:
 *     tags:
 *     - Auth
 *     description: Returns an "OK" message
 *     responses:
 *       200:
 *         description: "OK"
 *       401:
 *         description: "Unauthorized"
 */
app.get("/private", isAuthenticated, (req: Request, res: Response) => {
  return res.send("OK");
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
