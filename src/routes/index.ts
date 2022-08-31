import { UserRoute } from "./user.route";
import { ArticleRoute } from "./article.route";
import { ProfileRoute } from "./profile.route";
import { Application } from "express";

export const configRoute = (app: Application) => {
  app.use("/v1", UserRoute);
  app.use("/v1", ArticleRoute);
  app.use("/v1", ProfileRoute);
};
