import config from "./config/index";
import loadApp from "./ignition/index";
import express, { Application } from "express";

async function start() {
  const app: Application = express();

  const port: number = config.port;

  await loadApp(app);

  app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
  });
}

start();
