import { Post } from "../model/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../model/like.model.js";
import { Comment } from "../model/comment.model.js";

const createPost = async (req, res) => {
  try {
    const { content, visibility, location } = req.body;

    const owner = req.user?._id;

    if (!content && (!req.files || req.files.length === 0) && !req.body.video) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // IMAGE URLS
    const imageUrls = req.files?.map((file) => file.path) || [];

    const post = await Post.create({
      content,
      images: imageUrls,
      video: req.body.video || "",
      owner,
      visibility: visibility || "public",
      location: location || "",
    });

    const createdPost = await Post.findById(post._id).populate(
      "owner",
      "fullname username profile"
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost,
    });
  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find({
      isArchived: false,
      visibility: "public",
    })
      .populate("owner", "fullname username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      isArchived: false,
      visibility: "public",
    });

    return res.status(200).json({
      success: true,

      posts,

      pagination: {
        page,

        limit,

        totalPosts,

        totalPages: Math.ceil(totalPosts / limit),

        hasMore: skip + posts.length < totalPosts,
      },
    });
  } catch (error) {
    console.log("GET FEED POSTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feed posts",
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "owner",
      "fullname username profile"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log("GET SINGLE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find({
      owner: userId,
      isArchived: false,
    })
      .populate("owner", "fullname username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      owner: userId,
      isArchived: false,
    });

    return res.status(200).json({
      success: true,

      posts,

      pagination: {
        page,

        limit,

        totalPosts,

        totalPages: Math.ceil(totalPosts / limit),

        hasMore: skip + posts.length < totalPosts,
      },
    });
  } catch (error) {
    console.log("GET USER POSTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user posts",
    });
  }
};
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.user?._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // ONLY OWNER CAN DELETE
    if (post.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const { content, visibility, location } = req.body;

    const userId = req.user?._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // ONLY OWNER CAN UPDATE
    if (post.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this post",
      });
    }

    // UPDATE FIELDS
    if (content !== undefined) {
      post.content = content;
    }

    if (visibility !== undefined) {
      post.visibility = visibility;
    }

    if (location !== undefined) {
      post.location = location;
    }

    post.isEdited = true;

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "owner",
      "fullname username profile"
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
};
const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.user?._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // CHECK EXISTING LIKE
    const existingLike = await Like.findOne({
      post: postId,
      likedBy: userId,
    });

    // UNLIKE
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      post.likesCount = Math.max(0, post.likesCount - 1);

      await post.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: post.likesCount,
        message: "Post unliked",
      });
    }

    // LIKE
    await Like.create({
      post: postId,
      likedBy: userId,
    });

    post.likesCount += 1;

    await post.save();

    return res.status(200).json({
      success: true,
      liked: true,
      likesCount: post.likesCount,
      message: "Post liked",
    });
  } catch (error) {
    console.log("TOGGLE LIKE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
};
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const { content } = req.body;

    const userId = req.user?._id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      owner: userId,
    });

    // INCREMENT COMMENT COUNT
    post.commentsCount += 1;

    await post.save();

    const createdComment = await Comment.findById(comment._id).populate(
      "owner",
      "fullname username profile"
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: createdComment,
    });
  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: postId,
    })
      .populate("owner", "fullname username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      post: postId,
    });

    return res.status(200).json({
      success: true,

      comments,

      pagination: {
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        hasMore: skip + comments.length < totalComments,
      },
    });
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const userId = req.user?._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // ONLY OWNER CAN DELETE
    if (comment.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    // DECREMENT COMMENT COUNT
    await Post.findByIdAndUpdate(comment.post, {
      $inc: {
        commentsCount: -1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log("DELETE COMMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

export {
  createPost,
  getFeedPosts,
  getSinglePost,
  getUserPosts,
  deletePost,
  updatePost,
  toggleLikePost,
  addComment,
  getPostComments,
  deleteComment,
};
