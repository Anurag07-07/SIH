import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const DBConnect = async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL as string)
    console.log(`Database Connected`);
  } catch (error) {
    console.log(`Database Not Connected`);
    console.error(error);
    process.exit(1)
  }
}

export default DBConnect