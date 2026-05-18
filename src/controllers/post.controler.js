import { Post } from "../model/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  const { content, images, video } = req.body;

  if (!content && !images?.length && !video) {
    throw new ApiError(400, "Post content is required");
  }

  const post = await Post.create({
    content,
    images,
    video,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

export { createPost };
