import mongoose from "mongoose";

export type CommentDocument = {
  _id: 1;
  createdAt: "2016-02-18T03:22:56.637Z";
  updatedAt: "2016-02-18T03:22:56.637Z";
  body: "It takes a Jacobian";
  author: {
    username: "jake";
    bio: "I work at statefarm";
    image: "https://i.stack.imgur.com/xHWG8.jpg";
    following: boolean;
    followers: Array<mongoose.Types.ObjectId>;
  };
  articleSlug?: string;
};
const CommentSchema = new mongoose.Schema(
  {
    body: { required: true, type: String },
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    articleSlug: { required: true, type: String },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<CommentDocument>(
  "Comment",
  CommentSchema
);
