import dotenv from "dotenv";
import { Algorithm } from "jsonwebtoken";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error(".env file is missing.");
}

const config = {
  port: parseInt(process.env.PORT || "3001"),
  auth: {
    jwtSecret: process.env.JWT_SECRET || "secret",
    jwtAlgo: (process.env.JWT_ALGO || "HS256") as Algorithm,
    jwtReqProp: process.env.JWT_REQ_PROP || "token",
  },
  limiter: {
    timeWindow: parseInt(process.env.LIMITER_TIMEWINDOW || "3600"),
    routeWeights: {
      "/public1": parseInt(process.env.PUBLIC1_WEIGHT || "1"),
      "/public2": parseInt(process.env.PUBLIC2_WEIGHT || "2"),
      "/public3": parseInt(process.env.PUBLIC3_WEIGHT || "5"),
      "/private1": parseInt(process.env.PRIVATE1_WEIGHT || "1"),
      "/private2": parseInt(process.env.PRIVATE2_WEIGHT || "5"),
    },
    public: {
      maxRequests: parseInt(process.env.LIMITER_PUBLIC_MAX_REQ || "200"),
    },
    private: {
      maxRequests: parseInt(process.env.LIMITER_PRIVATE_MAX_REQ || "300"),
    },
  },
};

export default config;
