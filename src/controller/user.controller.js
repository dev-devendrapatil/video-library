import handleRegistration from "../service/user/user.register.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userSchemaValidator } from "../validators/user/user.register.validator.js";
import handleLogin from "../service/user/user.login.service.js";
import { loginValidator } from "../validators/user/user.login.validator.js";
import handleLogout from "../service/user/user.logout.service.js";
import { passwordValidator } from "../validators/user/user.changePassword.validator.js";
import handlePasswordChange from "../service/user/user.changePassword.service.js";
import { userUpdateValidator } from "../validators/user/user.update.validator.js";
import handleUpdateUser from "../service/user/user.update.service.js";
import { handleAvatarChange } from "../service/user/user.changeAvatar.service.js";
import handleCoverImageChange from "../service/user/user.changeCoverImage.service.js";
import handleTokenRegeneration from "../service/user/user.tokenRegeneration.service.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import getChannel from "../service/user/user.getChannel.service.js";
import getUserHistory from "../service/user/user.getHistory.service.js";
export const registerUser = asyncHandler(async (req, res, next) => {
  if (!req?.files?.avatar[0]?.path) {
    throw new ApiError(400, "avatar is required");
  }
  const { error, value } = userSchemaValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const avatarLocalPath = req?.files?.avatar[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;
  const newUser = await handleRegistration(
    value,
    avatarLocalPath,
    coverImageLocalPath
  );
  res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { error, value } = loginValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { refreshToken, accessToken } = await handleLogin(value);
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
  const updatedUser = await handleLogout(req.user);
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  const response = {
    user: updatedUser,
  };
  res.status(200).json(new ApiResponse(200, response, "User Logout"));
});
export const changePassword = asyncHandler(async (req, res, next) => {
  const { error, value } = passwordValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const user = await handlePasswordChange(value, req.user);
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
export const updateUser = asyncHandler(async (req, res, next) => {
  const { error, value } = userUpdateValidator.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const user = await handleUpdateUser(value, req.user);
  res.status(201).json(new ApiResponse(201, user, "User updated successfully"));
});
export const updateAvatar = asyncHandler(async (req, res, next) => {
  const newAvatarLocalFilePath = req?.file?.path;
  const oldAvatarServerFilePath = req.user.avatar;
  if (!newAvatarLocalFilePath) {
    throw new ApiError(400, "Please upload image");
  }
  const user = await handleAvatarChange(
    req.user,
    newAvatarLocalFilePath,
    oldAvatarServerFilePath
  );

  res
    .status(201)
    .json(new ApiResponse(201, user, "Avatar updated successfully"));
});
export const updateCoverImage = asyncHandler(async (req, res, next) => {
  const localCoverImagePath = req.file?.path;
  const oldCoverImageServerPath = req.user.coverImage;

  if (!localCoverImagePath) {
    throw new ApiError(400, "Please upload image");
  }
  const user = await handleCoverImageChange(
    req.user,
    localCoverImagePath,
    oldCoverImageServerPath
  );

  res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated successfully"));
});
export const regenerateAccessToken = asyncHandler(async (req, res, next) => {
  const oldRefreshToken = req.body?.refreshToken || req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new ApiError(403, "Invalid Request");
  }
  const response = await handleTokenRegeneration(oldRefreshToken);

  res.status(200).json(new ApiResponse(200, response, "New token generated"));
});

export const getChannelProfile = asyncHandler(async (req, res, next) => {
  const { userName } = req.body;
  if (!userName?.trim()) {
    throw new ApiError(400, "Username missing");
  }
  const channel = await getChannel(userName.trim())
  res.status(200).json(200, channel, "User channel fetch successfully");
});

export const getWatchHistory = asyncHandler(async (req, res, next) => {
 const userHistory = await getUserHistory(req.user.id)

  res.status(200).json(new ApiResponse(200,userHistory,"watch history fetch successfully"))
});
