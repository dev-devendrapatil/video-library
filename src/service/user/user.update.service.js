import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

const handleUpdateUser = async (body,user) => {
    const { userName, email, fullName } = body;
  const currentUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!currentUser) {
    throw new ApiError(400, "Problem while updating the user");
  }
  if (userName && userName?.trim().length !== 0) {
    currentUser.userName = userName;
  }
  if (email && email?.trim().length !== 0) {
    currentUser.email = email;
  }
  if (fullName && fullName?.trim().length !== 0) {
    currentUser.fullName = fullName;
  }
  await currentUser.save();
  return currentUser
}
export default  handleUpdateUser