import { Like } from "../models/like.modal.js";
import { handleToggleReaction } from "../service/Like/like.toggleReaction.service.js";
import { getLikedVideos } from "../service/Like/like.videos.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const handleToggleVideoLike = asyncHandler(async (req, res) => {
  const { id } = req.params; // video ID
  const { type } = req.body;

  if (!id || !["like", "dislike"].includes(type)) {
    throw new ApiError(400, "Invalid request");
  }
const response = await handleToggleReaction(id,type,req.user._id)

  res.status(200).json(new ApiResponse(200, response.data, response.message));
});

export const likedVideo =  asyncHandler(async (req,res) => {
  const userId = req.user._id
  if(!userId){
    throw new ApiError(400,"Invalid request")
  }
const likedVideos=await getLikedVideos(userId)
  res.status(200).json(new ApiResponse(200,likedVideos,"Liked video fetch successfully"))
})
