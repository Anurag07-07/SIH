import { Request, Response } from "express";
import {UserValidation} from '@repo/validation/validation'
import {client} from '@repo/postdb/postdb'
import bcrypt from 'bcrypt'
export const Signup = async(req:Request,res:Response)=>{
  const Check = UserValidation.safeParse(req.body)

  console.log(req
    .body
  );
  

  if (!Check.success) {
    return res.status(403).json({
      message:`Invalid Data`,
      error:Check.error.message
    })
  }

  const {username,password,email,photo,Phone} = req.body
  try {
    //Check user is present or not
    const user_present =  await client.user.findFirst({
      where:{
        username:username
      }
    })

    if (user_present) {
      return res.status(411).json({
        message:`User Already Exist`
      })
    }
    else{

      //Bcrypt the Password

      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(password,salt)

      await client.user.create({
        data:{
          username:username,
          password:hashPassword,
          email:email,
          Phone:Phone,
          photo:photo
        }
      })

      return res.status(201).json({
        message:`User Created Successfully`
      })
    }
  } catch (error) {
    return res.status(500).json({
      "message":`Internal Server Error`
    })
  }
}