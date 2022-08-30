import { parseUserResponse } from "./../helper/responseFormat";
import { signToken } from "./../helper/signToken";
import { User } from "./../models/user.model";
import { AppError } from "./../error";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
const signupAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //prepare
    const { email, password, username } = req.body.user;
    if (!username) throw new AppError(400, "username is required");
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    //save to database
    let user = await User.create({
      email,
      hashedPassword,
      username,
    });

    //sign token
    const token = signToken(user.email, user.username);
    user.token = token;
    //send response
    res.status(201).json(parseUserResponse(user));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username });
    if (!user) throw new AppError(400, "user not found");

    user.token = req.token;
    res.status(200).json(parseUserResponse(user));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      username: newUsername,
      password,
      image,
      bio,
    } = req.body.user;
    const username = req.username;
    const updateObj: any = {};

    if (email) updateObj["email"] = email;
    if (newUsername) updateObj["username"] = newUsername;
    if (password) updateObj["hashedPassword"] = await bcrypt.hash(password, 10);
    if (image) updateObj["image"] = image;
    if (bio) updateObj["bio"] = bio;

    const user = await User.findOneAndUpdate({ username }, updateObj, {
      new: true,
    });
    if (!user) throw new AppError(400, "user not found");

    const token = signToken(user.email, user.username);
    user.token = token;
    res.status(200).json(parseUserResponse(user));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const signInAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body.user;
    const user = await User.findOne({ email });
    if (!user) throw new AppError(400, "email not found");
    const isAuth = await bcrypt.compare(password, user.hashedPassword);
    if (!isAuth) throw new AppError(400, "password is incorrect");

    const token = signToken(user.email, user.username);
    user.token = token;
    res.status(200).json(parseUserResponse(user));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};

export const UserController = {
  signupAccount,
  getUser,
  updateUser,
  signInAccount,
};
