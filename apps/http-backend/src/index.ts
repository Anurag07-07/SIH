import dotenv from 'dotenv'
dotenv.config({path:'/.env'})
import e from "express";
import user from './routes/user.route.js'
import DBConnect from './db/dbConnection.js';
const app = e();

app.use(e.json())
const PORT = process.env.PORT || 3000

//Database Connected
DBConnect()

//Routing
app.use('/api/v1',user)


app.listen(PORT,()=>{
  console.log(`Server Started at PORT ${PORT}`);
})