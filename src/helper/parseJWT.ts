import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
export const parseJWT = (token: string) => {
  const result = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  return result;
};
