import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";

const handleTokenRegeneration = async (oldRefreshToken) => {
      const decodeOldRefreshToken = jwt.decode(
    oldRefreshToken,
    process.env.APP_REFRESH_TOKEN_SECRET
  );
  if (!decodeOldRefreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const currentUser = await User.findById(decodeOldRefreshToken._id);
  if (!currentUser) {
    throw new ApiError(403, "Invalid Request");
  }
  if (oldRefreshToken !== currentUser.refreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const newRefreshToken = await currentUser.generateRefreshToken();
  const newAccessToken = await currentUser.generateAccessToken();
  const response = {
    userName: currentUser.userName,
    newAccessToken,
    newRefreshToken,
  };
  return response
}
export default handleTokenRegeneration