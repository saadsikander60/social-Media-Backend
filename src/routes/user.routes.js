import { Router } from "express";
import {registerUser,loginUser, logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserCoverImage,updateUserAvatar} from "../controllers/user.controler.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/register').post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }, // ✅ FIXED
  ]),
  registerUser
);

    router.route('/login').get(loginUser);


    //==========secured route==============================================================
    router.route('/logout').post(verifyJwt,logoutUser)
    router.route('/refresh-token').post(refreshAccessToken)
    router.route('/change-password').post(verifyJwt,changeCurrentPassword)
     router.route('/get-User').get(verifyJwt,getCurrentUser)
      router.route('/update-details').patch(verifyJwt,updateAccountDetails)
       router.route('/update-cover').patch(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }, // ✅ FIXED
  ]),updateUserCoverImage)
        router.route('/update-avatar').patch(verifyJwt,updateUserAvatar)




    


export default router;