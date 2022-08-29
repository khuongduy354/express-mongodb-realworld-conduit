import { AppError } from "./../error";
import mongoose from "mongoose";
let url = process.env.DB_URL as string | "";
export const configDb = async () => {
  try {
    await mongoose.connect(url);
  } catch (e) {
    throw new AppError(500, "Database Connection Error");
  }
};
