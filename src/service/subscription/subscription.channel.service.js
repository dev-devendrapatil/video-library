import mongoose from "mongoose";
import { Subscription } from "../../models/subscription.model.js";

export const handleSubscribedChannel = async (userId) => {
  const pipeline = [
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users", // must match the actual collection name
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "channelDetails._id",
        foreignField: "channel",
        as: "subscriberList",
      },
    },
    {
      $addFields: {
        totalSubscribers: { $size: "$subscriberList" },
        isSubscribed: true, // always true in this list
      },
    },
    {
      $project: {
        _id: "$channelDetails._id",
        userName: "$channelDetails.userName",
        avatar: "$channelDetails.avatar",
        totalSubscribers: 1,
        isSubscribed: 1,
      },
    },
  ];

  const result = await Subscription.aggregate(pipeline);
  return result;
};
