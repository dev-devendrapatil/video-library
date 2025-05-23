import mongoose from "mongoose";
import { Like } from "../../models/like.modal.js";
import { Video } from "../../models/video.model.js";

export const handleGetReaction = async (id, userId) => {
  // 1. Fetch video to get channel owner
  const video = await Video.findById(id).select("owner");
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  // 2. Get like/dislike counts
  const reactions = await Like.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  let likeCount = 0;
  let dislikeCount = 0;

  for (const reaction of reactions) {
    if (reaction._id === "like") likeCount = reaction.count;
    if (reaction._id === "dislike") dislikeCount = reaction.count;
  }
  // 4. Check user reaction
  const userReactionDoc = await Like.findOne({
    likeBy: userId,
    video: id,
  }).select("type");

  const userReaction = userReactionDoc?.type || null;
  return {
    likeCount,
    dislikeCount,
    userReaction,
  };
};
