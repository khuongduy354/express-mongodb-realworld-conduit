import { Router } from "express";

const router = Router();
//CRUD articles
router.post("/articles");
router.get("/articles"); //query: author,tag,favorited,limit,skip
router.get("/articles/:slug");

router.delete("/articles/:slug");
router.put("/articles/:slug");

//CRUD articles interactions
//feed
router.get("/articles/feed"); //query: limit,skip

//favorite
router.post("/articles/:slug/favorite");
router.delete("/articles/:slug/favorite");

//comments
router.post("/articles/:slug/comments");
router.get("/articles/:slug/comments");
router.delete("/articles/:slug/comments/:id");

//tag
router.get("/tags");
export { router as UserRoute };
