import { User } from "../../models/user.modal.js";

const handleLogout = async (user) => {
      const updateUser = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: {
        refreshToken: undefined,
      },
    }
  );
  return updateUser
}
export default handleLogout