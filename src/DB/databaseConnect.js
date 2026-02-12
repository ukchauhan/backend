import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URl}/${DB_Name}`);
        console.log("MongoDB connected !!!");

    }catch(error){
        console.log("MongoDB connection Error !!");
        console.log(error);

    }
}

export default connectDB;