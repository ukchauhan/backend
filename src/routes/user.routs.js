import { Router } from "express";
import { registerUser, userLogin, userLogout } from "../controllers/user.controller.js";
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
router.route("/logout").post(verifyJWT,userLogout); 

export default router;