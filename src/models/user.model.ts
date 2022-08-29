import mongoose from "mongoose";

type UserDocument = {
  email: "jake@jake.jake";
  username: "jake";
  bio: "I work at statefarm";
  image: "https://api.realworld.io/images/smiley-cyrus.jpg";
  // following: false;
};
const UserSchema = new mongoose.Schema(
  {
    email: { required: true, type: String },
    username: { required: true, type: String },
    hashedPassword: { required: true, type: String },
    bio: String,
    image: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", UserSchema);
