import { User } from "../../models/user.modal.js";
import { ApiError } from "../../utils/ApiError.js";
import { deleteImageFromUrl, uploadOnCloudinary } from "../../utils/cloudnary.js";

 const handleCoverImageChange = async (user,localCoverImagePath,oldCoverImageServerPath)=>{

  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!currentUser) {
    throw new ApiError(400, "User not found");
  }
  const newCoverImage = await uploadOnCloudinary(localCoverImagePath);
  if (!newCoverImage) {
    throw new ApiError(400, "Issue while uploading image");
  }
  currentUser.coverImage = newCoverImage.url;
  await currentUser.save();
  deleteImageFromUrl(oldCoverImageServerPath);
  return currentUser
}
export default handleCoverImageChange