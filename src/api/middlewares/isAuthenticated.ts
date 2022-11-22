import { expressjwt as jwt } from "express-jwt";
import { Request } from "express";
import config from "../../config/index";

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    return token;
  }
  return undefined;
};

const isAuthenticated = jwt({
  secret: config.jwtSecret || "secret",
  algorithms: ["HS256"],
  requestProperty: "token",
  getToken: extractToken,
});

export default isAuthenticated;
