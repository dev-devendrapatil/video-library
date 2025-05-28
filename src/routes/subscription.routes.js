import { Router } from "express"
import { auth } from "../middleware/auth.middleware.js"
import { getAllSubscribedUsers, getSubscribedChannels, isUserSubscribedToChannel, toggleSubscribeChannel } from "../controller/subscription.controller.js"

export const subscriptionRouter  = Router()

subscriptionRouter.post("/:id",auth,toggleSubscribeChannel)
subscriptionRouter.get("/subscribedChannels",auth,getSubscribedChannels)
subscriptionRouter.get("/subscribedUsers",auth,getAllSubscribedUsers)
subscriptionRouter.get('/isSubscribed/:id',auth,isUserSubscribedToChannel)
