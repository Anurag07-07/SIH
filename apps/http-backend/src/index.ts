import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
import e from "express";
import user from './routes/user.route.js'
import DBConnect from './db/dbConnection.js';
import cookieParser from 'cookie-parser';
const app = e();

app.use(e.json())
app.use(cookieParser())
const PORT = process.env.PORT || 3000

//Database Connected
DBConnect()

//Routing
app.use('/api/v1',user)


app.listen(PORT,()=>{
  console.log(`Server Started at PORT ${PORT}`);
})