import e,{Request,Response} from "express";
import {client} from '@repo/postdb/postdb'
import bcrypt from 'bcrypt'
//Create a signup Route 
export const Signup = async(req:Request,res:Response)=>{
  const {email,username,password,phone} = req.body
  try {
    //Check if the User is present or not with the username
    
    const present = await client.user.findFirst({
      where:{
        username
      }
    })


    
    if (present) {
      return res.status(409).json({
        message:`User already present`
      })
    }else{
      //Hash the Password
      const hashedPassword = await bcrypt.hash(password,10)
      
      const user = await client.user.create({
        data:{
          username,
          password:hashedPassword,
          email,
          Phone:phone
        }
      })
      return res.status(201).json({
        message:`User Created Successfully`,
        userid:user.id
      })
    }
  } catch (error) {
    res.status(500).json({
      message:`Internal Server Error`,
      error:error
    })
  }
}
