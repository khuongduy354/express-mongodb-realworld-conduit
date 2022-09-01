import { CommentDocument } from "./../models/comment.model";
import { ArticleDocument } from "./../models/article.model";
import { UserDocument } from "./../models/user.model";
export const parseUserResponse = (user: UserDocument) => {
  return {
    user: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      email: user.email,
      token: user.token,
    },
  };
};

export const parseArticleResponse = (article: ArticleDocument) => {
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: article.favoritedBy,
      favoritesCount: article.favoritedBy.length,
      author: article.author,
    },
  };
};
export const parseArticlesResponse = (articles: Array<ArticleDocument>) => {
  const new_articles = articles.map((article) => {
    return { ...parseArticleResponse(article).article };
  });
  return {
    articles: new_articles,
    articlesCount: new_articles.length,
  };
};

export const parseCommentResponse = (comment: CommentDocument) => {
  return {
    comment: {
      id: comment._id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      following: comment.author.following,
    },
  };
};
export const parseCommentsResponse = (comments: Array<CommentDocument>) => {
  const new_comments = comments.map((comment) => {
    return { ...parseCommentResponse(comment).comment };
  });
  return {
    comments: new_comments,
  };
};

export const parseProfileResponse = (user: UserDocument) => {
  return {
    profile: {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: user.following,
    },
  };
};
