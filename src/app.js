import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json());//middleware accept json data
app.use(express.urlencoded({extended : true}));// accept data from url
app.use(express.static("public"));//store static file in public
app.use(cookieParser());//

export {app}
