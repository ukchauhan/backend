import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async(req , res)=>{

    res.send("working correct!!!");
    res.status(200).json({
        message:'ok'
    })
});

export {registerUser}