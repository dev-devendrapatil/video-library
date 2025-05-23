import { handleDeleteVideo } from "../service/video/video.delete.js";
import { handleVideoUpdate } from "../service/video/video.update.js";
import { handleVideoUpload } from "../service/video/video.upload.js";
import getUserVideos from "../service/video/video.user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { updateVideoValidator } from "../validators/video/video.update.validator.js";
import { newVideoValidator } from "../validators/video/video.uploadNewVideo.validator.js";
import { handleVideoById } from "../service/video/video.findById.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.modal.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { handleGetReaction } from "../service/video/video.reaction.js";

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
  const obj = await handleVideoUpload(
    value,
    thumbnailLocalPath,
    videoLocalPath,
    req.user._id
  );
  if (!obj) {
    throw new ApiError(400, "There is something wrong");
  }
  res
    .status(200)
    .json(new ApiResponse(201, obj, "Video uploaded successfully"));
});
export const userVideos = asyncHandler(async (req, res) => {
  const user = req.user;
  const videos = await getUserVideos(user);
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetch successfully"));
});
export const updateVideo = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req?.files?.thumbnail?.[0]?.path;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Invalid request");
  }
  const { error, value } = updateVideoValidator.validate(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const video = await handleVideoUpdate(id, value, thumbnailLocalPath);

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});
export const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    ApiError(400, "Invalid Request");
  }
  const deletedVideo = await handleDeleteVideo(id);
  res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video Deleted successfully"));
});
export const getVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Invalid request");
  }
  const video = await handleVideoById(id,req.user._id);
  res.status(200).json(new ApiResponse(200, video, "Video fetch successfully"));
});


export const getVideoReactions = asyncHandler(async (req, res) => {
  const { id } = req.params; // videoId
  const userId = req.user?._id;
  const response = await handleGetReaction(id,userId)
  res.status(200).json(new ApiResponse(200,response,"fetch reaction successfully"));
});
