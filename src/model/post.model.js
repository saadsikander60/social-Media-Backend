import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    // POST TEXT
    content: {
      type: String,
      trim: true,
      maxlength: 2200, // insta style
      default: "",
    },

    // MULTIPLE IMAGES
    images: [
      {
        type: String, // cloudinary urls
      },
    ],

    // OPTIONAL VIDEO
    video: {
      type: String,
      default: "",
    },

    // POST OWNER
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // POST VISIBILITY
    visibility: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },

    // HASHTAGS
    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // TAGGED USERS
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // LOCATION
    location: {
      type: String,
      trim: true,
      default: "",
    },

    // COUNTS
    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },

    savesCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    // EDIT STATUS
    isEdited: {
      type: Boolean,
      default: false,
    },

    // PINNED POST
    isPinned: {
      type: Boolean,
      default: false,
    },

    // ARCHIVED
    isArchived: {
      type: Boolean,
      default: false,
    },

    // DISABLE COMMENTS
    allowComments: {
      type: Boolean,
      default: true,
    },

    // REPORT STATUS
    reportsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ================= INDEXES =================

// SEARCH
postSchema.index({ content: "text" });

// FEED PERFORMANCE
postSchema.index({ createdAt: -1 });

// OWNER POSTS
postSchema.index({ owner: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
