import { User } from "../../models/user.model.js";

const getUserHistory = async (id) => {
  const userHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
          {
            $project: {
              title: 1,
              description: 1,
              owner: {
                fullName: "$owner.fullName",
                avatar: "$owner.avatar",
                email: "$owner.email",
                userName: "$owner.userName",
              },
            },
          },
        ],
      },
    },
  ]);
  return userHistory[0].watchHistory;
};
export default getUserHistory;
