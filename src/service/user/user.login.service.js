import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

const handleLogin = async (body) => {
     const { userName, email, password } = body;
  const user = await User.findOne({
    $or: [
      {
        userName,
      },
      {
        email,
      },
    ],
  });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }
  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(400, "Invalid Credentials");
  }
  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();
  user.refreshToken = refreshToken;
  await user.save();
  return {refreshToken,accessToken}
}
export default  handleLogin