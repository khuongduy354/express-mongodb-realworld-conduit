import { logger } from "./../logger";
import { AppError } from "./../error";
import mongoose from "mongoose";
import "dotenv/config";
let url = process.env.DB_URL ? process.env.DB_URL : "";
export const configDb = async () => {
  try {
    await mongoose.connect(url);
    logger.info("Connected to mongoDB");
  } catch (e) {
    throw new AppError(500, "Database Connection Error");
  }
};
