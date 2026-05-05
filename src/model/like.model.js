import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

// ❗ duplicate like prevent
likeSchema.index(
  { user: 1, post: 1, video: 1, comment: 1 },
  { unique: true }
);

export const Like = mongoose.model("Like", likeSchema);