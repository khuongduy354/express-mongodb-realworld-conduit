import mongoose from "mongoose";

type CommentDocument = {
  id: 1;
  createdAt: "2016-02-18T03:22:56.637Z";
  updatedAt: "2016-02-18T03:22:56.637Z";
  body: "It takes a Jacobian";
  author: {
    username: "jake";
    bio: "I work at statefarm";
    image: "https://i.stack.imgur.com/xHWG8.jpg";
    following: false;
  };
};
const CommentSchema = new mongoose.Schema(
  {
    body: { required: true, type: String },
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<CommentDocument>(
  "Comment",
  CommentSchema
);
