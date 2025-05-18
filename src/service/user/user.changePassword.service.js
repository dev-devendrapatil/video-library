import { User } from "../../models/user.modal.js";
import { ApiError } from "../../utils/ApiError.js";

const handlePasswordChange = async (value, user) => {
  const { password, newPassword } = value;
  const currentUser = await User.findById(user._id);
  const isPasswordCorrect = await currentUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Credentials");
  }
  currentUser.password = newPassword;
  currentUser.save();
  return currentUser;
};
export default handlePasswordChange;
