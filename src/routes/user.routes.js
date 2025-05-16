import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

export const userRouter = Router();

userRouter.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
