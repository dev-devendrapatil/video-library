import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";

const handleRegistration = async(body,avatarLocalPath,coverImageLocalPath)=>{
const { fullName, userName, email, password } = body;
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
let avatar={url:""},coverImage={url:""}
  if(avatarLocalPath){
       avatar = await uploadOnCloudinary(avatarLocalPath);

  }
  if(coverImage){
   coverImage = await uploadOnCloudinary(coverImageLocalPath);

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
  return createdUser
}

export default handleRegistration