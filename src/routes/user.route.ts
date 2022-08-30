import { auth } from "./../middlewares/auth";
import { UserController } from "./../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/users", UserController.signupAccount);
router.post("/users/login", UserController.signInAccount);

router.get("/user", auth, UserController.getUser);
router.put("/user", auth, UserController.updateUser);
export { router as UserRoute };
