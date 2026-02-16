import {asyncHandler} from "../utils/asyncHandler.js"
import {apiErrorHandler} from "../utils/apiErrorHandler.js"
import {User} from "../models/user.model.js"//for chek existed user
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async(req , res)=>{
  const {fullName,email, username, password} = req.body
  console.log("email :", email);


  if(// validation check if any field is empty
    [fullName,email,username,password].some((field)=> field?.trim() === "")
  ){
    throw new apiErrorHandler(400,"All fields are must required");
  };

  //validation check if user is already exists or not
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })

  if(existedUser){
    throw new apiErrorHandler(409,"User with email or username is already exists");
  }

  const avtarLocalPath = req.files?.avtar[0]?.path;// if req in file exists than avtar[0] exists 
                                                    // than path if exists in local 
  const coverImgPath = req.files?.coverImg[0]?.path;

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

  if(!avtarLocalPath){
    throw new apiErrorHandler(400,"avtarFile is required!!!!");
  }

  //upload it on cloudinary
  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImgPath);

  if(!avtar){
    throw new apiErrorHandler(400,"avtarFile is required!!!!");
  }

  //entry of user in database
    const user = await User.create({
    fullName,
    avtar:avtar.url,
    coverImg:coverImg?.url || "",
    email,
    password,
    username:username.toLowerCase()
  });

  //check user is created or not  or not select mention 2 fields
  const createdUser = await User.findById(user._id).select(
    "-password  -refreshToken"
  );

  if(!createdUser){
    throw new apiErrorHandler(500,"somethin went wrong while regestering user");
  }

    return res.status(201).json(
        new apiResponse(200,createdUser,"User registered successfully!!")
  )


});

const userLogin = asyncHandler(async (req,res)=>{

  const {email,username,password} = req.body;

  console.log(req.body);


  if(!username && !email){
    throw new apiErrorHandler(400,"Email or username is required !!");
  }

  const user = await User.findOne({
  $or: [
    { email: email?.trim() },
    { username: username?.trim() }
  ]
  });


  if (!user) {
    throw new apiErrorHandler(404, "User does not exist")
  }

  if (!user) {
    throw new apiErrorHandler(404, "User does not exist")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

});

const userLogout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiErrorHandler(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new apiErrorHandler(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiErrorHandler(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new apiErrorHandler(401, error?.message || "Invalid refresh token")
    }

});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apiErrorHandler(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"))
});

const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200,req.user,"Current user fetched successfully !!")
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new apiErrorHandler(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}//this will return new updated value of user ---
        
    ).select("-password")

    return res
    .status(200)
    .json(new apiResponse(200, user, "Account details updated successfully"))
});


export {registerUser , userLogin , userLogout, 
        refreshAccessToken , changeCurrentPassword, getCurrentUser,
        updateAccountDetails    
}