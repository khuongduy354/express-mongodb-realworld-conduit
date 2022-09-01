import { parseJWT } from "./../helper/parseJWT";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { AppError } from "../error";

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get token
    let token = req.headers["Authorization"] || req.header("Authorization");
    if (!token) {
      req.isAuth = false;
      next();
    } else {
      token = token?.slice(6) as string;

      //get username from token
      const parsedToken = parseJWT(token);
      const username = parsedToken.username;

      //ensures user exists
      const user = await User.findOne({ username });
      if (!user) return next(new AppError(401, "Invalid token"));

      req.username = username;
      req.token = token;
      req.isAuth = true;
      next();
    }
  } catch (e) {
    next(new AppError(400, "Invalid token"));
  }
};
