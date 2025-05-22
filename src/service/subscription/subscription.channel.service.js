import mongoose from "mongoose"
import { Subscription } from "../../models/subscription.model.js"

export const handleSubscribedChannel = async (userId) => {
    const subscribedChannel = await Subscription.find({
        subscriber:new mongoose.Types.ObjectId(userId)
    }).populate('channel', '_id userName avatar').select("channel")
    return subscribedChannel
}