import { Router } from "express";
import { changePassword, loginUser, logoutUser, regenerateAccessToken, registerUser, updateAvatar, updateCoverImage, updateUser, userDetails } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { auth } from "../middleware/auth.middleware.js";

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
userRouter.post('/login',loginUser)
userRouter.post('/logout',auth,logoutUser)
userRouter.post('/changePassword',auth,changePassword)
userRouter.get('/regenerateToken',regenerateAccessToken)
userRouter.get('/userDetails',auth,userDetails)
userRouter.patch('/updateUser',auth,updateUser)
userRouter.patch('/updateAvatar',auth,upload.single('avatar'),updateAvatar)
userRouter.patch('/updateCoverImage',auth,upload.single('coverImage'),updateCoverImage)

