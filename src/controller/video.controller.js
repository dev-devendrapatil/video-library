import { handleVideoUpload } from "../service/video/video.upload.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { newVideoValidator } from "../validators/video/video.uploadNewVideo.validator.js";

export const uploadNewVideo = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;
  const videoLocalPath = req?.files?.videoFile[0]?.path;
  if (!thumbnailLocalPath || !videoLocalPath) {
    throw new ApiError(400, "Thumbnail/Video is required");
  }
  const { error, value } = newVideoValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const obj = await handleVideoUpload(value,thumbnailLocalPath,videoLocalPath,req.user._id);
  if(!obj){
    throw new ApiError(400,"There is something wrong")
  }
  res.status(200).json(new ApiResponse(201,obj,"Video uploaded successfully"))
});
