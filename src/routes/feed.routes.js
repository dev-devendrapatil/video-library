import { Router } from "express";
import { allFeedVideos } from "../controller/feed.controller.js";
import { auth } from "../middleware/auth.middleware.js";

export const feedRouter = Router()

feedRouter.get("/:page",auth,allFeedVideos)