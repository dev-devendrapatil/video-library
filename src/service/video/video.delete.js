import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const handleDeleteVideo = async (videoId) => {
  const video=   await Video.deleteOne({
    _id: videoId,
  });
  if(!video){
    throw new ApiError("Delete request gone wrong")
  }
  return video
}