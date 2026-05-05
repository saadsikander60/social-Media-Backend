import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    images: [
      {
        type: String, // cloudinary URLs
      },
    ],

    video: {
      type: String, // optional video URL
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   

    commentsCount: {
      type: Number,
      default: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);