import dotenv from 'dotenv'

import connectDB from "./DB/databaseConnect.js";

dotenv.config({ path: '.env' })
connectDB();