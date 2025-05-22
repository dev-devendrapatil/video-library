import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { handleSubscription } from "../service/subscription/subscription.handle.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const toggleSubscribeChannel = asyncHandler(async (req,res) => {
    const {id} = req.params
    const userId = req.user._id
    if(!id){
        throw new ApiError(400,"Invalid Request")
    }
        const [subscriptionResponse,message] = await handleSubscription(userId,id)
        res.status(200).json(new ApiResponse(200,subscriptionResponse,message))

  
})
export const getSubscribedChannels = asyncHandler(async (req,res) => {
    console.log("hi")
    const userId= req.user._id
    console.log("userId",userId)
    const subscribedChannel = await Subscription.find({
        subscriber:new mongoose.Types.ObjectId(userId)
    }).populate('channel', '_id userName avatar').select("channel")
    res.status(200).json( new ApiResponse(200,subscribedChannel,"Successfully fetch all subscribed channel"))
})
export const getAllSubscribedUsers = asyncHandler(async (req,res) => {
    const userId = req.user._id
const subscriptions = await Subscription.find({ channel: userId }).populate('subscriber','_id,userName avatar').select('subscriber');
const total = subscriptions.length;
    res.status(200).json(new ApiResponse(200,{
        subscribedUsers:subscriptions,
        totalCount:total
    },"Successfully fetch all subscribed users"))
})