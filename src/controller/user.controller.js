import { User } from "../models/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteImageFromUrl, uploadOnCloudinary } from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";
export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, userName, email, password } = req.body;
  if (
    [fullName, userName, email, password].some((item) => item?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserAlreadyExist = await User.findOne({
    $or: [
      {
        userName: userName,
      },
      {
        email: email,
      },
    ],
  });
  if (isUserAlreadyExist) {
    throw new ApiError(400, "User already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await new User({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName,
  });
  await user.save();
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
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
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 24 * 60 * 60 * 1000 * 7,
  });
  res.cookie("accessToken", accessToken, {
    ...options,
    maxAge: 24 * 60 * 60 * 1000,
  });
  const response = {
    refreshToken,
    accessToken,
  };
  res
    .status(200)
    .json(new ApiResponse(200, response, "User Logged in successfully"));
});
export const logoutUser = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $set: {
        refreshToken: undefined,
      },
    }
  );
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  const response = {
    user: updateUser,
  };
  res.status(200).json(new ApiResponse(200, response, "User Logout"));
});
export const changePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;
  if ([password, newPassword].some((item) => item.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Credentials");
  }
  user.password = newPassword;
  user.save();
  res
    .status(201)
    .json(new ApiResponse(201, user, "Password changed successfully"));
});
export const userDetails = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(400, "Error while retrieving user details");
  }
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetch successfully"));
});
export const updateUser = asyncHandler(async (req, res, params) => {
  const { userName, email, fullName } = req.body;
  if (
    [userName, email, fullName].every(
      (item) => item?.trim().length == 0 || !item
    )
  ) {
    throw new ApiError(400, "No fields received for edit");
  }
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "Problem while updating the user");
  }
  if (userName && userName?.trim().length !== 0) {
    user.userName = userName;
  }
  if (email && email?.trim().length !== 0) {
    user.email = email;
  }
  if (fullName && fullName?.trim().length !== 0) {
    user.fullName = fullName;
  }
  await user.save();
  res.status(201).json(new ApiResponse(201, user, "User updated successfully"));
});
export const updateAvatar = asyncHandler(async (req, res, params) => {
  const newAvatarLocalFilePath = req.file?.path;
  const oldAvatarServerFilePath = req.user.avatar;
  if (!newAvatarLocalFilePath) {
    throw new ApiError(400, "Please upload image");
  }
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const newAvatarOnServer = await uploadOnCloudinary(newAvatarLocalFilePath);
  if (!newAvatarOnServer) {
    throw new ApiError(500, "Error while uploading image");
  }
  user.avatar = newAvatarOnServer.url;
  await user.save();
  if (oldAvatarServerFilePath) {
    deleteImageFromUrl(oldAvatarServerFilePath);
  }
  res.status(201)
    .json(new ApiResponse(201, user, "Avatar updated successfully"));
});
export const updateCoverImage = asyncHandler(async (req,res,next) => {
    const localCoverImagePath = req.file?.path
      const oldCoverImageServerPath = req.user.coverImage;

    if(!localCoverImagePath){
      throw new ApiError(400,"Please upload image")
    }
      const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const newCoverImage=await uploadOnCloudinary(localCoverImagePath)
  if(!newCoverImage){
    throw new ApiError(400,"Issue while uploading image")
  }
  user.coverImage=newCoverImage.url
  await user.save()
  deleteImageFromUrl(oldCoverImageServerPath)
  res.status(200).json(new ApiResponse(200,user,"Cover Image updated successfully"))
})
export const regenerateAccessToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.body?.refreshToken || req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const decodeOldRefreshToken = jwt.decode(
    oldRefreshToken,
    process.env.APP_REFRESH_TOKEN_SECRET
  );
  if (!decodeOldRefreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const user = await User.findById(decodeOldRefreshToken._id);
  if (!user) {
    throw new ApiError(403, "Invalid Request");
  }
  if (oldRefreshToken !== user.refreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const newRefreshToken = await user.generateRefreshToken();
  const newAccessToken = await user.generateAccessToken();
  const response = {
    userName: user.userName,
    newAccessToken,
    newRefreshToken,
  };
  res.status(200).json(new ApiResponse(200, response, "New token generated"));
});
