import { Tag } from "./../models/tag.model";
import { slugConvert } from "../config/slugConvert";
import {
  parseArticleResponse,
  parseArticlesResponse,
  parseCommentResponse,
  parseCommentsResponse,
} from "./../helper/responseFormat";
import { User } from "./../models/user.model";
import { AppError } from "./../error";
import { NextFunction, Request, Response } from "express";
import { Article } from "../models/article.model";
import { Comment } from "../models/comment.model";

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username }).select("username _id");
    if (!user) throw new AppError(400, "User not found");

    const { title, description, body, tagList } = req.body.article;
    const articleObj: any = {
      title,
      description,
      body,
      favoritedBy: [user.username],
      author: user._id,
      slug: slugConvert(title),
    };

    if (tagList) {
      await Tag.insertMany(tagList.map((tag: string) => ({ name: tag })));
      articleObj.tagList = tagList;
    }

    const article = await (
      await Article.create(articleObj)
    ).populate("author", "username bio image");

    article.author.following = false;
    article.favorited = true;
    res.status(201).json(parseArticleResponse(article));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const getArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOne({ slug }).populate(
      "author",
      "username bio image"
    );
    if (!article) throw new AppError(400, "Article not found");

    res.status(200).json(parseArticleResponse(article));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};

const listArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { author, favorited, limit, skip, tag } = req.query;
    const _limit = limit ? Number(limit) : 20;
    const _skip = skip ? Number(skip) : 0;
    const findObj: any = {};
    if (author) findObj["author.username"] = author;
    if (favorited) findObj.favoritedBy = { $in: [favorited] };
    if (tag) findObj.tagList = { $in: [tag] };

    const articles = await Article.find(findObj).limit(_limit).skip(_skip);

    res.status(200).json(parseArticlesResponse(articles));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const username = req.username;
    const user = await User.findOne({ username }).select("_id");
    if (!user) throw new AppError(400, "User not found");

    const article = await Article.findOneAndDelete({ slug, author: user._id });
    if (!article)
      throw new AppError(
        400,
        "Article not exists for delete, or you are not the author"
      );
    res.status(204).json();
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //prepare input
    const username = req.username;
    const { slug } = req.params;
    const { title, description, body } = req.body.article;
    const user = await User.findOne({ username }).select("_id");
    if (!user) throw new AppError(400, "User not found");

    //prepare update object
    const articleObj: any = {};
    if (title) {
      (articleObj.title = title), (articleObj.slug = slugConvert(title));
    }
    if (description) articleObj.description = description;
    if (body) articleObj.body = body;

    //update
    const article = await Article.findOneAndUpdate(
      { slug, author: user._id },
      articleObj,
      {
        new: true,
      }
    ).populate("author", "username bio image");
    if (!article) throw new AppError(400, "Article not found");
    res.status(200).json(parseArticleResponse(article));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const favoriteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const username = req.username;
    if (!username) throw new AppError(400, "User not found");

    const article = await Article.findOne({ slug });
    if (!article) throw new AppError(400, "Article not found");
    if (!article.favoritedBy.includes(username)) {
      article.favoritedBy.push(username);
      await article.save();
      res.status(200);
    }
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //prepare
    const { slug } = req.params;
    const { body } = req.body.comment;
    const username = req.username;

    //get user and articles
    const user = await User.findOne({ username }).select("_id");

    if (!user) throw new AppError(400, "User not found");
    if (!username) throw new AppError(400, "User not found");

    const article = await Article.findOne({
      slug,
      "author.username": username,
    });
    if (!article) throw new AppError(400, "Article not found");

    //create comment and push to article
    const comment = await (
      await Comment.create({ body, author: user._id })
    ).populate("author", "username bio image");
    article.comments.push(comment._id as any);
    await article.save();
    //add article slug to comment
    comment.articleSlug = slug;
    await comment.save();

    //response
    comment.author.following = false;
    res.status(201).json(parseCommentResponse(comment));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const username = req.username;

    const user = await User.findOne({ username }).select("_id followees");
    if (!user) throw new AppError(400, "User not found");

    const comments = await Comment.find({ articleSlug: slug }).populate(
      "author",
      "username bio image _id"
    );

    comments.forEach((comment) => {
      //@ts-ignore
      comment.author.following = user.followees.includes(comment.author._id);
    });

    res.status(200).json(parseCommentsResponse(comments));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug, id } = req.params;
    const username = req.username;
    if (!username) throw new AppError(400, "User not found");

    await Comment.findOneAndDelete({
      _id: id,
      articleSlug: slug,
      "author.username": username,
    });

    res.status(200);
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _tags = await Tag.find({}).lean();
    const tags = _tags.map((tag) => tag.name);
    res.status(200).json({ tags });
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const unfavoriteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const username = req.username;
    if (!username) throw new AppError(400, "User not found");

    const article = await Article.findOne({ slug });
    if (!article) throw new AppError(400, "Article not found");

    if (article.favoritedBy.includes(username)) {
      article.favoritedBy = article.favoritedBy.filter(
        (user) => user !== username
      );
      await article.save();
      res.status(200);
    }
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.username;
    const { limit, skip } = req.query;
    let _limit = 20;
    let _skip = 0;
    if (limit) _limit = Number(limit);
    if (skip) _skip = Number(skip);

    const user = await User.findOne({ username }).select("_id followees");
    if (!user) throw new AppError(400, "User not found");
    const articles = await Article.find({ author: { $in: user.followees } })
      .limit(_limit)
      .skip(_skip)
      .sort({ createdAt: -1 });

    res.status(200).json(parseArticlesResponse(articles));
  } catch (e) {
    next(new AppError(400, "mongodb error", e));
  }
};
export const ArticleController = {
  createArticle,
  getArticle,
  listArticles,
  updateArticle,
  deleteArticle,

  getFeed,
  favoriteArticle,
  unfavoriteArticle,

  createComment,
  getComments,
  deleteComment,

  getTags,
};
