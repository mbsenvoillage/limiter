import express, { Application, Request, Response } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

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
 * /health:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/health", (req: Request, res: Response) => {
  res.send("Service is up.");
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
