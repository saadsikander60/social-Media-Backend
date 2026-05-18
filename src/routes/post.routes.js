import { Router } from "express";
import { createPost } from "../controllers/post.controler.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJwt, createPost);

export default router;
