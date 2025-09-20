import { Request, Response } from "express";
import {UserValidation,SigninValidation} from '@repo/validation/validation'
import {client} from '@repo/postdb/postdb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

export const Signin = async(req:Request,res:Response)=>{
  const check = SigninValidation.safeParse(req.body)
  if (!check.success) {
    return res.status(403).json({
      message:`Invalid Data`
    })
  }

  const {username,password} = req.body
  try {
    
    const user_present = await client.user.findFirst({
      where:{
        username:username
      },
      select:{
        id:true,
        password:true 
      }
    })

    if (!user_present) {
      return res.status(411).json({
        message:`User Not Present`
      })
    }else{
      const matched_password = await bcrypt.compare(password,user_present.password)
      if (!matched_password) {
        return res.status(401).json({
          message:`Invalid Password`
        })
      }else{
        //If Matched password create Token
        const token = jwt.sign({
          id:user_present.id  
        },process.env.JWT_SECRET as string)

        //Store In the Cookies
        res.cookie('token',token)

        return res.status(201).json({
          message:'User Signed Successfully'
        })
      }
    }
  } catch (error) {
    return res.status(500).json({
      message:`Internal Server Error`
    })
  }
}