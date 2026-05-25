import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendEmail from "../utils/sendEmail.js";
import { forgotPasswordTemplate } from "../mails/forgotPasswordTemplate.js";
import { Post } from "../model/post.model.js";
import jwt from "jsonwebtoken";
import { json, response } from "express";

const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      501,
      "something went wrng with generating acces and refresh token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const profileLocalPath = req.files?.profile?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!profileLocalPath) {
    throw new ApiError(400, "profile image is required");
  }

  const profile = await uploadOnCloudinary(profileLocalPath);

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!profile?.url) {
    throw new ApiError(500, "Unable to upload profile image");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    profile: profile.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) {
    throw new ApiError(400, "password is required");
  }
  if (!email) {
    throw new ApiError(403, "email is required");
  }

  const checkUser = await User.findOne({ email });
  if (!checkUser) {
    throw new ApiError(404, "user not registered");
  }

  const isPassValid = await checkUser.isPasswordCorrect(password);
  if (!isPassValid) {
    throw new ApiError(401, "wrong password detected");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    checkUser._id
  );

  const userLoggedIn = await User.findById(checkUser._id).select(
    "-password  -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      statusCode: 200,
      user: userLoggedIn,

      message: "user logged in successfully",
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    new ApiError(401, "unotherized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newrefreshToken },
          "Acsess token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }

  user.password = newPassword;
  save in db - (await user.save({ validateBeforeSave: false }));
  response;
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullname, username } = req.body;
  if (!fullname && !email && !username) {
    throw new ApiError(400, "Some fields required to update ");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        fullname,
        email,
        username,
      },
    },
    { new: true }
  ).select("-password");
  return response;
  return res.status(200).json(new ApiResponse(200, user, "details updated"));
});
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverimageLocatPath = req.files?.coverImage?.[0]?.path;

  console.log("REQ FILES:", req.files);
  console.log(coverimageLocatPath);

  if (!coverimageLocatPath) {
    throw new ApiError(400, "cover image local path error");
  }

  const coverimage = await uploadOnCloudinary(coverimageLocatPath);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverimage: coverimage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "coverimage updated successfully"));
});

const updateUserprofile = asyncHandler(async (req, res) => {
  const profileLocalPath = req.files?.profile?.[0]?.path;
  if (!profileLocalPath) {
    throw new ApiError(200, "upload again");
  }

  const profile = await uploadOnCloudinary(profileLocalPath);
  if (!profile.url) {
    throw new ApiError(500, "cloud upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profile: profile.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "profile updated succesfully"));
});

const reqUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const reqChannel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },

    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },

        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },

        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        profile: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!reqChannel?.length) {
    throw new ApiError(404, "channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, reqChannel[0], "user channel fetched successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: " channel",
        as: "subcribers",
      },
    },

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subcribedTo",
      },
    },
    {
      $add: {
        subscriberCount: {
          $size: "$subscribers",
        },

        channelsubscribedtocount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $condition: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        fullname: 1,
        username: 1,
        profile: 1,
        channelsubscribedtocount: 1,
        subscriberCount: 1,
        isSubscribed: 1,
        coverimage: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "user data fetched"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // 5 DIGIT OTP
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  console.log("NEW TEMPLATE RUNNING");
  console.log("OTP:", otp);

  user.resetOtp = otp;

  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  await sendEmail(email, `Flowin OTP ${otp}`, forgotPasswordTemplate(otp));

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "otp sent successfully"));
});
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "email otp and newPassword are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (user.resetOtp !== otp) {
    throw new ApiError(400, "invalid otp");
  }

  if (user.resetOtpExpiry < Date.now()) {
    throw new ApiError(400, "otp expired");
  }

  user.password = newPassword;

  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password reset successfully"));
});

const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // EMPTY QUERY
    if (!query) {
      return res.status(200).json({
        users: [],
        posts: [],
        pagination: {
          page,
          limit,
          hasMore: false,
        },
      });
    }

    // ================= USERS SEARCH =================

    const users = await User.find({
      $or: [
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
        {
          fullname: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select("fullname username profile")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    // ================= POSTS SEARCH =================

    const posts = await Post.find({
      $or: [
        {
          caption: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .populate("owner", "fullname username profile")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // ================= TOTAL COUNTS =================

    const totalUsers = await User.countDocuments({
      $or: [
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
        {
          fullname: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });

    const totalPosts = await Post.countDocuments({
      caption: {
        $regex: query,
        $options: "i",
      },
    });

    const totalResults = totalUsers + totalPosts;

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,

      query,

      users,

      posts,

      pagination: {
        page,

        limit,

        totalUsers,

        totalPosts,

        totalResults,

        hasMore: skip + users.length + posts.length < totalResults,
      },
    });
  } catch (error) {
    console.log("SEARCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

export {
  registerUser, //saad
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserprofile,
  updateCoverImage,
  reqUserProfile,
  getUserChannelProfile,
  forgotPassword,
  resetPassword,
  searchUsers,
};
