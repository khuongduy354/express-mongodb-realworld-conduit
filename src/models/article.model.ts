import mongoose from "mongoose";

type ArticleDocument = {
  slug: "how-to-train-your-dragon";
  title: "How to train your dragon";
  description: "Ever wonder how?";
  body: "It takes a Jacobian";
  tagList: ["dragons", "training"];
  createdAt: "2016-02-18T03:22:56.637Z";
  updatedAt: "2016-02-18T03:48:35.824Z";
  favorited: false;
  favoritesCount: 0;
  author: {
    username: "jake";
    bio: "I work at statefarm";
    image: "https://i.stack.imgur.com/xHWG8.jpg";
    following: false;
  };
};
const ArticleSchema = new mongoose.Schema(
  {
    slug: String,
    title: { required: true, type: String },
    description: { required: true, type: String },
    body: { required: true, type: String },
    tagList: Array,
    favorited: Boolean,
    favoritesCount: Number,
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Article = mongoose.model<ArticleDocument>(
  "Article",
  ArticleSchema
);
