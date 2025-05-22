import { Subscription } from "../../models/subscription.model.js"
import { User } from "../../models/user.model.js"
import { ApiError } from "../../utils/ApiError.js"

export const handleSubscription = async (userId,channelId) => {
    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(400,"Invalid request")
    }

      const subscribeRequest = {
        subscriber:userId,
        channel:channelId
    }
    //isAlready subscribed
    const isAlreadySubscribed= await Subscription.findOne(subscribeRequest)
    if(isAlreadySubscribed){
        const deleteSubscription = await Subscription.deleteOne(subscribeRequest)
        if(!deleteSubscription){
            throw new ApiError(400,"Some thing went wrong")
        }
        return [deleteSubscription,"Successfully unsubscribed"]
    }
    else{
        const subscription =  Subscription(subscribeRequest)
      const addSubscription=  await subscription.save()
        if(!addSubscription){
            throw new ApiError(400,"Some thing went wrong")
        }
       return  [addSubscription,"Successfully Subscribed"]
    }
}