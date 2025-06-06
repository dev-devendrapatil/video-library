
import { handleSubscription } from "../service/subscription/subscription.handle.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { handleSubscribedChannel } from "../service/subscription/subscription.channel.service.js";
import { handleSubscribedUser } from "../service/subscription/subscription.user.service.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { isChannelSubscribed } from "../service/video/video.channelSubscribed.js";
import mongoose from "mongoose";

export const toggleSubscribeChannel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!id) {
    throw new ApiError(400, "Invalid Request");
  }
  const [subscriptionResponse, message] = await handleSubscription(userId, id);
  res.status(200).json(new ApiResponse(200, subscriptionResponse, message));
});
export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const subscribedChannel = await handleSubscribedChannel(userId);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannel,
        "Successfully fetch all subscribed channel"
      )
    );
});
export const getAllSubscribedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const response = await handleSubscribedUser(userId);

  res
    .status(200)
    .json(
      new ApiResponse(200, response, "Successfully fetch all subscribed users")
    );
});
export const isUserSubscribedToChannel = asyncHandler(async (req,res) => {
  const {id} = req.params
  if(!id){
    throw new ApiError(400,"Invalid request")
  }
  const response = await isChannelSubscribed(id,req.user._id)
  res.status(200).json(new ApiResponse(200,response,"Details fetch successfully"))
})
