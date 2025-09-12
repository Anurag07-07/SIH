import {DBConnect} from '@repo/mongodb/mongodb' 
import e from "express";
import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
const app = e();

//Mongo Database Connection
DBConnect()

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server Started at PORT ${PORT}`);
})