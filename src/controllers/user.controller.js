import {asyncHandler} from "../utils/asyncHandler.js"
import {apiErrorHandler} from "../utils/apiErrorHandler.js"
import {User} from "../models/user.model.js"//for chek existed user
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
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

export {registerUser}