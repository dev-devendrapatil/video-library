import { Subscription } from "../../models/subscription.model.js";

export const handleSubscribedUser = async (userId) => {
    const subscriptions = await Subscription.find({ channel: userId }).populate('subscriber','_id userName avatar').select('subscriber');
const total = subscriptions.length;
    return {
       subscribedUser:subscriptions,totalCount:total
    }
    
}