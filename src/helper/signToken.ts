import jwt from "jsonwebtoken";
import "dotenv/config";
export const signToken = (email: string, username: string) => {
  const token = jwt.sign(
    { email, username },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  return token;
};
