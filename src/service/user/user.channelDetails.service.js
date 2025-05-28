import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Subscription } from "../../models/subscription.model.js";

export const getUserChannelDetails = async (id) =>{
  const channelDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "videos", // MongoDB collection name (usually lowercase plural)
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $project: {
        userName: 1,
        avatar: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        videos: {
          _id: 1,
          thumbnail: 1,
          title: 1,
          duration: 1,
          views: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  if (channelDetails.length === 0) {
    throw new ApiError(404, "Channel not found");
  }

  // Get total subscribers count for this channel
  const totalSubscribers = await Subscription.countDocuments({ channel: id });

  // Add subscriber count to response
  const channelData = {
    ...channelDetails[0],
    totalSubscribers,
  };
  return channelData
}