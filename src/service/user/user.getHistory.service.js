import mongoose from "mongoose";
import { User } from "../../models/user.model.js";

const getUserHistory = async (id) => {
  const user = await User.findById(id).populate({
    path: "watchHistory.video",
    populate: {
      path: "owner", 
      model: "User",
          select: "-password -refreshToken -watchHistory", 
    },
  });;

  if (!user) {
    throw new Error("User not found");
  }

  return user.watchHistory;
};
export default getUserHistory;
