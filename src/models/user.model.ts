import mongoose from "mongoose";

export type UserDocument = {
  email: "jake@jake.jake";
  username: "jake";
  bio: "I work at statefarm";
  image: "https://api.realworld.io/images/smiley-cyrus.jpg";
  hashedPassword: string;
  token?: string;
  followees: Array<mongoose.Types.ObjectId>;
  following?: boolean;
};
const UserSchema = new mongoose.Schema(
  {
    email: { required: true, type: String, unique: true },
    username: { required: true, type: String, unique: true },
    hashedPassword: { required: true, type: String },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    followees: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
