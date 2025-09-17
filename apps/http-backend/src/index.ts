import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
import e from "express";
import DBConnect from './db/dbConnection.js';
const app = e();

const PORT = process.env.PORT || 3000

//Database Connected
DBConnect()

app.listen(PORT,()=>{
  console.log(`Server Started at PORT ${PORT}`);
})