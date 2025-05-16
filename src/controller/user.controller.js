import { User } from "../models/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

export const registerUser = asyncHandler(async(req, res, next) => {
  const { fullName, userName, email, password } = req.body;
  if (
    [fullName, userName, email, password].some((item) => item?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserAlreadyExist = await User.findOne ({
    $or: [
      {
        userName: userName,
      },
      {
        email: email,
      },
    ],
  });
  console.log("is",isUserAlreadyExist)
if(isUserAlreadyExist){
    throw new ApiError(400,"User already exists")
}
const avatarLocalPath=req.files?.avatar[0]?.path
const coverImageLocalPath=req.files?.coverImage[0]?.path
 console.log("avatarLocalPath",avatarLocalPath)
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  console.log("avatar",avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,'Avatar is required')
    }
    const user = await new User({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        userName

    })
    await user.save()
    const createdUser= await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong")
    }
    res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))

});
