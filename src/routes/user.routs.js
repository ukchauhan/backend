import { Router } from "express";
import { refreshAccessToken, registerUser, userLogin, userLogout,
    changeCurrentPassword,getCurrentUser,updateAccountDetails } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router  = Router();

router.route("/register").post(
    upload.fields([// inject middleware to upload file 
        {
            name:"avtar",
            maxCount:1
        },
        {
            name:"coverImg",
            maxCount:1
        }
    ]),
    registerUser
);

router.route("/login").post(userLogin);

//secured
router.route("/logout").post(verifyJWT,userLogout); 
router.route("/refresh-Accesstoken").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


export default router;