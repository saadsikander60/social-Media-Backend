import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvatar,
  reqUserProfile,
  getUserChannelProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }, // ✅ FIXED
  ]),
  registerUser
);

router.route("/login").get(loginUser);

//==========secured route==============================================================
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/get-User").get(verifyJwt, getCurrentUser);
router.route("/update-details").patch(verifyJwt, updateAccountDetails);
router.route("/update-cover").patch(
  verifyJwt,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }, // ✅ FIXED
  ]),
  updateCoverImage
);

router.route("/update-avatar").patch(
  verifyJwt,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }, // ✅ FIXED
  ]),
  updateUserAvatar
);

router.route("/profile/:username").get(verifyJwt, reqUserProfile);

// GET USER CHANNEL PROFILE
router.route("/channel/:username").get(verifyJwt, getUserChannelProfile);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password").post(resetPassword);

export default router;
