import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const handleVideoUpdate = async (id,value,thumbnailLocalPath) => {
    if (!thumbnailLocalPath && Object.values(value).every((item) => item == "")) {
    throw new ApiError(400, "No change detected");
  }

  const { title, description, isPublished } = value;

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(400, "Invalid request");
  }
  video.title = title ?? video.title;
  video.description = description ?? video.description;
  video.isPublished = isPublished ?? video.isPublished;
  const updatedVideo = await video.save();
  if (!updatedVideo) {
    throw new ApiError(
      400,
      "Unable to proceed with the request. Please try again later."
    );
  }
  return updatedVideo
}