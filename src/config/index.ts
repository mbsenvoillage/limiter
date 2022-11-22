import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error(".env file is missing.");
}

const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  limiter: {
    timeWindow: process.env.LIMITER_TIMEWINDOW,
    routeWeights: {
      "/public1": process.env.PUBLIC1_WEIGHT,
      "/public2": process.env.PUBLIC2_WEIGHT,
      "/public3": process.env.PUBLIC3_WEIGHT,
      "/private1": process.env.PRIVATE1_WEIGHT,
      "/private2": process.env.PRIVATE2_WEIGHT,
    },
    public: {
      maxRequests: process.env.LIMITER_PUBLIC_MAX_REQ,
    },
    private: {
      maxRequests: process.env.LIMITER_PRIVATE_MAX_REQ,
    },
  },
};

export default config;
