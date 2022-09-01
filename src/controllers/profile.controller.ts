import { parseProfileResponse } from "./../helper/responseFormat";
import { User } from "./../models/user.model";
import { AppError } from "./../error";
import { NextFunction, Request, Response } from "express";
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const isAuth = req.isAuth;

    const profile = await User.findOne({ username }).select(
      "username bio image _id"
    );
    if (!profile) throw new AppError(404, "User not found");

    if (isAuth) {
      const user = await User.findOne({ username: req.username }).select(
        "followees"
      );
      if (!user) throw new AppError(404, "User not found");
      profile.following = user.followees.includes(profile._id);
    } else {
      profile.following = false;
    }
    res.status(200).json(parseProfileResponse(profile));
  } catch (err) {
    next(new AppError(400, "mongodb error", err));
  }
};

const followProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //prepare
    const { username } = req.params;
    const followee = await User.findOne({ username });
    if (!followee) throw new AppError(404, "User not found");
    const follower = await User.findOne({ username: req.username });
    if (!follower) throw new AppError(404, "User not found");

    followee.following = true;
    //follow
    if (
      !follower.followees.includes(followee._id) &&
      followee._id != follower._id
    ) {
      follower.followees.push(followee._id);
      await follower.save();
    }
    res.status(200).json(parseProfileResponse(followee));
  } catch (err) {
    next(new AppError(400, "mongodb error", err));
  }
};
const unfollowProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //prepare
    const { username } = req.params;
    const followee = await User.findOne({ username });
    if (!followee) throw new AppError(404, "User not found");
    const follower = await User.findOne({ username: req.username });
    if (!follower) throw new AppError(404, "User not found");
    followee.following = false;
    //follow
    if (
      follower.followees.includes(followee._id) &&
      followee._id != follower._id
    ) {
      follower.followees = follower.followees.filter(
        (id) => id !== followee._id
      );
      await follower.save();
    }
    res.status(200).json(parseProfileResponse(followee));
  } catch (err) {
    next(new AppError(400, "mongodb error", err));
  }
};
export const ProfileController = {
  getProfile,
  followProfile,
  unfollowProfile,
};
