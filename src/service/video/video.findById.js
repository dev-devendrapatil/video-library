import mongoose from "mongoose";
import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Subscription } from "../../models/subscription.model.js";
import { User } from "../../models/user.model.js";

export const handleVideoById = async (id, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let video;

  try {
    await Video.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $inc: { views: 1 } },
      { session }
    );

    video = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          videoFile: 1,
          title: 1,
          description: 1,
          views: 1,
          createdAt: 1,
          owner: {
            userName: 1,
            avatar: 1,
            _id: 1,
          },
        },
      },
    ]).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
const user = await User.findById(userId);

// Convert id to string to avoid ObjectId comparison issues
const videoIdStr = id.toString();

const existingIndex = user.watchHistory.findIndex(
  (item) => item.video.toString() === videoIdStr
);

if (existingIndex !== -1) {
  // Update visitedAt if video already exists in history
  user.watchHistory[existingIndex].visitedAt = new Date();
} else {
  // Add new entry to watch history
  user.watchHistory.push({
    video: id,
    visitedAt: new Date(),
  });
}

await user.save();

  // 🚨 After session ends, handle result
  if (!video || video.length === 0) {
    throw new ApiError(400, "Video not found");
  }

  return video[0];
};
