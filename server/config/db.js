import mongoose  from "mongoose";
import env from "./env.js";
import { config } from "dotenv";
config()
export const connectDatabase = async () => {
  
    try {
        await mongoose.connect(env.DATABASE_URL);
        console.log("Mongo DB connected",env.GMAIL_ID);
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}