import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // seconds
    },

    views: {
      type: Number,
      default: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },



    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);