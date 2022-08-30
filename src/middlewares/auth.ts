import { User } from "./../models/user.model";
import { parseJWT } from "./../helper/parseJWT";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../error";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get token
    let token = req.headers["Authorization"] || req.header("Authorization");
    if (!token) next(new AppError(401, "No token found"));
    token = token?.slice(6) as string;

    //get username from token
    const parsedToken = parseJWT(token);
    const username = parsedToken.username;

    //ensures user exists
    const user = await User.findOne({ username });
    if (user) {
      req.username = username;
      req.token = token;
      next();
    } else {
      next(new AppError(401, "Invalid token"));
    }
  } catch (e) {
    next(new AppError(400, "Invalid token"));
  }
};
