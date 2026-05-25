import express from "express";
import {
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
} from "../controllers/post.controler.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create-post", verifyJwt, upload.array("images", 5), createPost);
router.get("/feed", getFeedPosts);
router.get("/:postId", getSinglePost);
router.get("/user/:userId", getUserPosts);
router.delete("/delete/:postId", verifyJwt, deletePost);
router.patch("/update/:postId", verifyJwt, updatePost);
router.post("/like/:postId", verifyJwt, toggleLikePost);
router.post("/comment/:postId", verifyJwt, addComment);

router.get("/comments/:postId", getPostComments);

router.delete("/comment/delete/:commentId", verifyJwt, deleteComment);

export default router;
