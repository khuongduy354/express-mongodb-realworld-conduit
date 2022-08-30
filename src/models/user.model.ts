import mongoose from "mongoose";

export type UserDocument = {
  email: "jake@jake.jake";
  username: "jake";
  bio: "I work at statefarm";
  image: "https://api.realworld.io/images/smiley-cyrus.jpg";
  hashedPassword: string;
  token?: string;
  following?: boolean;
};
const UserSchema = new mongoose.Schema(
  {
    email: { required: true, type: String },
    username: { required: true, type: String },
    hashedPassword: { required: true, type: String },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
