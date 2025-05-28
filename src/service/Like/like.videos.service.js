import { Like } from "../../models/like.modal.js";

export const getLikedVideos = async (userId) => {
  const likedVideos = await Like.find({
    likeBy: userId,
    type: "like",
  }).populate({
    path: "video",
    populate: {
      path: "owner",
      model: "User",
      select: "-password -refreshToken -watchHistory", // exclude sensitive fields
    },
  });
  return likedVideos
};
