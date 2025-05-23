import { Like } from "../../models/like.modal.js";
import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const handleToggleReaction = async (id,type,userId) => {
    
  const isVideoValid = await Video.findById(id);
  if (!isVideoValid) {
    throw new ApiError(404, "Video not found");
  }

  const existingReaction = await Like.findOne({
    likeBy: userId,
    video: id,
  });

  let response = {};

  if (existingReaction) {
    if (existingReaction.type !== type) {
      existingReaction.type = type;
      response.data = await existingReaction.save();
      response.message = "Reaction updated successfully";
    } else {
      await Like.findByIdAndDelete(existingReaction._id);
      response.data = null;
      response.message = "Reaction removed successfully";
    }
  } else {
    response.data = await Like.create({
      likeBy: userId,
      video: id,
      type,
    });
    response.message = "Reaction added successfully";
  }
  return response
}