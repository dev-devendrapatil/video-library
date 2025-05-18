import { User } from "../../models/user.modal.js";
import { ApiError } from "../../utils/ApiError.js";
import { deleteImageFromUrl, uploadOnCloudinary } from "../../utils/cloudnary.js";

export const handleAvatarChange= async (user,newAvatarLocalFilePath,oldAvatarServerFilePath) => {
      const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!currentUser) {
    throw new ApiError(400, "User not found");
  }
  const newAvatarOnServer = await uploadOnCloudinary(newAvatarLocalFilePath);
  if (!newAvatarOnServer) {
    throw new ApiError(500, "Error while uploading image");
  }
  currentUser.avatar = newAvatarOnServer.url;
  await currentUser.save();
  if (oldAvatarServerFilePath) {
    deleteImageFromUrl(oldAvatarServerFilePath);
  }
  return currentUser
}