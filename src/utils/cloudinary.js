import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary} from "cloudinary";// cloudinary import
import fs from "fs";//node js fisle system manage file operations

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});
console.log("Cloudinary config:", process.env.CLOUDINARY_API_KEY);

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         console.log("file is uploaded on cloudinary ", response.url);
//         // fs.unlinkSync(localFilePath)//file system
//         // return response;

//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded:", response.secure_url);

        // delete temp file AFTER upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {

        console.log("Cloudinary upload error:", error);

        // delete temp file only if exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};




export {uploadOnCloudinary}