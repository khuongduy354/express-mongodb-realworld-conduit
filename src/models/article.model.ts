import mongoose from "mongoose";

export type ArticleDocument = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: Array<string>;
  createdAt: String;
  updatedAt: String;
  favorited?: boolean;
  favoritedBy: Array<string>;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
  comments: Array<mongoose.Types.ObjectId>;
};
const ArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { required: true, type: String },
    description: { required: true, type: String },
    body: { required: true, type: String },
    tagList: { type: [String], default: [] },
    favoritedBy: { type: [String], default: [] },
    author: {
      required: true,
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Article = mongoose.model<ArticleDocument>(
  "Article",
  ArticleSchema
);
