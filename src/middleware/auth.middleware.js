import  jwt  from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const auth = async (req, res, next) => {
try {
      const accessToken = req.cookies.accessToken||req.header("Authorization")?.replace("Bearer","");
      if(!accessToken){
        throw new ApiError(403,"Unauthorized Request")
      }
      const jwtDecode = await jwt.verify(accessToken,process.env.APP_ACCESS_TOKEN_SECRET)
      const user = await User.findById(jwtDecode?._id).select("-password -refreshToken")
      if(!user){
        throw new ApiError(403,"Unauthorized Request")
      }
      req.user=user
      next()
} catch (error) {
    res.status(403).json(new ApiResponse(403,error.message,"auth failed"))
}
  
};
