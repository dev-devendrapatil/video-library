import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";

export const handleVideoUpload = async(value,thumbnailLocalPath,videoLocalPath,userId)=>{
      const { title, description, isPublished } = value;
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");
  const video = await uploadOnCloudinary(videoLocalPath, "video");
    if(!thumbnail||!video){
        throw new ApiError(400,"Error while uploading data")
    }
  const obj = {
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    duration: video.duration,
    isPublished: isPublished === "true",
    owner: userId,
  };
  const db = new Video(obj);
  const response = await db.save();
  return response
}