import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
export const DBConnect = async()=>{
  try {
    console.log(process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`Mongo Database Connected`);
  } catch (error) {
    console.log("DB Not Connected");
    console.error(error);
    process.exit(1)
  }
} 