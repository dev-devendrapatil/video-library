import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema(
  {
    likeBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.plugin(aggregatePaginate);

export const Like = mongoose.model("Like", likeSchema);
