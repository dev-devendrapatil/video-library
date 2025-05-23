import { Subscription } from "../../models/subscription.model.js"
import { User } from "../../models/user.model.js"
import { ApiError } from "../../utils/ApiError.js"

export const isChannelSubscribed = async (id,userId) => {
    const user = await User.findById(id)
  if(!user){
    throw new ApiError(400,"Invalid Request")
  }
  const isUserSubscribed = await Subscription.findOne({
    subscriber:userId,
    channel:id
  })
  const response = {
    isSubscribed : isUserSubscribed?true:false
  }
  return response
}