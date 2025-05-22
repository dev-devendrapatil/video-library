import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";

const getUserVideos = async (user) => {
//   const userVideos = await Video.find({ owner: user._id });
const userVideos = await Video.aggregate([
  {
    $match: {
      owner: user._id
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner"
    }
  },
  {
    $unwind: "$owner"
  },
  {
    $project: {
      _id: 1,
      title: 1,
      views:1,
      isPublished:1,
      description: 1,
      duration:1,
      videoUrl: 1,
      thumbnail: 1,
      createdAt: 1,
      updatedAt: 1,
      // Add all fields you want from the Video document here

      owner: {
        fullName: "$owner.fullName",
        avatar: "$owner.avatar",
        userName: "$owner.userName"
      }
    }
  }
])



  if (!userVideos) {
    throw new ApiError(400, "Unable to fetch the videos");
  }
  return userVideos
};
export default getUserVideos;
