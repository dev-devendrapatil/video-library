import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const allFeedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {page} = req.params
  
const feed = await Video.aggregatePaginate(
  [
    {
      $match: {
        owner: { $ne: new mongoose.Types.ObjectId(userId) },
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $addFields: {
        "owner.password": "$$REMOVE",
        "owner.refreshToken": "$$REMOVE",
        "owner.watchHistory": "$$REMOVE",
      },
    },
  ],
  {
    page: parseInt(page) || 1,
    limit: 1,
  }
);

  if(!feed){
    throw new ApiError(400,"Some thing went wrong")
  }
  res.status(200).json(new ApiResponse(200,feed,"Feed fetch successfully"))
});
