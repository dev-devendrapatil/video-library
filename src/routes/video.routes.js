import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { deleteVideoById, getVideoById, getVideoReactions, updateVideo, uploadNewVideo, userVideos } from "../controller/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import multer from "multer";
import { isUserSubscribedToChannel } from "../controller/subscription.controller.js";

export const videoRouter = Router();
const videoUpload = (req, res, next) => {
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size exceeds 10MB limit" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    next(); // Proceed to controller
  });
};
videoRouter.post("/newVideo", auth, videoUpload, uploadNewVideo);
videoRouter.get('/userVideos',auth,userVideos)
videoRouter.get('/video/:id',auth,getVideoById)
videoRouter.patch('/updateVideo/:id',auth,videoUpload,updateVideo)
videoRouter.delete("/deleteVideo/:id",auth,deleteVideoById)
videoRouter.get('/reaction/:id',auth,getVideoReactions)