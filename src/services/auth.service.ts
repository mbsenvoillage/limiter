import jwt from "jsonwebtoken";

export default class AuthenticationService {
  public makeToken(): string {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        id: "id",
      },
      "secret"
    );
  }
}


