import { optionalAuth } from "./../middlewares/optionalAuth";
import { auth } from "./../middlewares/auth";
import { ArticleController } from "./../controllers/article.controller";
import { Router } from "express";

const router = Router();
//CRUD articles
router.post("/articles", auth, ArticleController.createArticle);
router.get("/articles", ArticleController.listArticles); //query: author,tag,favorited,limit,skip
//feed
router.get("/articles/feed", auth, ArticleController.getFeed); //query: limit,skip
router.get("/articles/:slug", ArticleController.getArticle);

router.delete("/articles/:slug", auth, ArticleController.deleteArticle);
router.put("/articles/:slug", auth, ArticleController.updateArticle);

//CRUD articles interactions

//favorite
router.post(
  "/articles/:slug/favorite",
  auth,
  ArticleController.favoriteArticle
);
router.delete(
  "/articles/:slug/favorite",
  auth,
  ArticleController.unfavoriteArticle
);

//comments
router.post("/articles/:slug/comments", auth, ArticleController.createComment);
router.get(
  "/articles/:slug/comments",
  optionalAuth,
  ArticleController.getComments
); //query: limit,skip
router.delete(
  "/articles/:slug/comments/:id",
  auth,
  ArticleController.deleteComment
);

//tag
router.get("/tags", ArticleController.getTags);
export { router as ArticleRoute };
