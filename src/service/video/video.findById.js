import mongoose from "mongoose";
import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Subscription } from "../../models/subscription.model.js";

export const handleVideoById = async (id, userId) => {
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
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
      $project: {
        videoFile: 1,
        title: 1,
        description: 1,
        views: 1,
        owner: {
          userName: 1,
          avatar: 1,
          _id:1
        },
      },
    },
  ]);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }
  video[0].isSubscribed = false;
  const subscribeRequest = {
    subscriber: userId,
    channel:video[0].owner._id,
  };
  console.log("subscribeRequest",subscribeRequest)
  const isSubscribed = await Subscription.findOne(subscribeRequest);
  if (isSubscribed) {
    video[0].isSubscribed = true;
  }
  return video;
};
