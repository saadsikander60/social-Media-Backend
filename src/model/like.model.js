import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ONE USER CAN LIKE ONLY ONCE
likeSchema.index({ post: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
