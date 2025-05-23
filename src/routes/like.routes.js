import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { handleToggleVideoLike, likedVideo } from "../controller/like.controller.js";

export const likeRouter = Router()

likeRouter.post("/reaction/:id",auth,handleToggleVideoLike)
likeRouter.get("/videos",auth,likedVideo)