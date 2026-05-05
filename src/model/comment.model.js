import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
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

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

   
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);