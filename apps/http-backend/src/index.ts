import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
import e from "express";
import user from './routes/user.route.js'
import image from './routes/image.route.js'
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
app.use('/api/v1',image)


app.listen(PORT,()=>{
  console.log(`Server Started at PORT ${PORT}`);
})