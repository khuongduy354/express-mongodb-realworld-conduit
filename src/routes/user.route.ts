import { Router } from "express";

const router = Router();

router.post("/users"); //maybe celeb
router.post("/users/login");

router.get("/user");
router.put("/user");
export { router as UserRoute };
