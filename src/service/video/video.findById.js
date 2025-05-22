import mongoose from "mongoose"
import { Video } from "../../models/video.model.js"
import { ApiError } from "../../utils/ApiError.js"

export const handleVideoById=async (id) => {
    const video = await Video.aggregate([
  {
    $match:{
      _id:new mongoose.Types.ObjectId(id)
    }
  },
  {
    $lookup:{
      from :"users",
      localField:"owner",
      foreignField:"_id",
      as:"owner"
    }
  },
  {
    $unwind:"$owner"
  },
  {
    $project:{
      videoFile:1,
      title:1,
      description:1,
      views:1,
      owner:{
        userName:1,
        avatar:1,
        
      }
    }
  }
])
if(!video){
  throw new ApiError(400,"Video not found")
}
return video
}