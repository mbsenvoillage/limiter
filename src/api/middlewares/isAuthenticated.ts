import { expressjwt as jwt } from "express-jwt";
import { Request } from "express";

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    return token;
  }
  return undefined;
};

const isAuthenticated = jwt({
  secret: "secret", // The _secret_ to sign the JWTs
  algorithms: ["HS256"], // JWT Algorithm
  requestProperty: "token", // Use req.token to store the JWT
  getToken: extractToken, // How to extract the JWT from the request
});

export default isAuthenticated;
