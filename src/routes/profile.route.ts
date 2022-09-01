import { auth } from "./../middlewares/auth";
import { optionalAuth } from "./../middlewares/optionalAuth";
import { ProfileController } from "./../controllers/profile.controller";
import { Router } from "express";

const router = Router();
router.get("/profiles/:username", optionalAuth, ProfileController.getProfile);
router.post(
  "/profiles/:username/follow",
  auth,
  ProfileController.followProfile
);
router.delete(
  "/profiles/:username/unfollow",
  auth,
  ProfileController.unfollowProfile
);

export { router as ProfileRoute };
