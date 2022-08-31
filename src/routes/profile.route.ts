import { Router } from "express";

const router = Router();
router.get("/profiles/:username");
router.post("/profiles/:username/follow");
router.delete("/profiles/:username/follow");

export { router as ProfileRoute };
