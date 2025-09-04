import { Router } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserModel, TodoModel} from '../model/userModel'
import { emailExist } from "../middlewares/userMiddleware";



dotenv.config();
const SECRET = process.env.CLIENT_SECRET

const router = Router();

router.post('/signup', async(req,res)=>{

   try {
    console.log('signup')
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5); 

     await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    });
    res.status(200).json({
        message: "You are signed up"
    })
  } catch (error) {
    res.status(500).json(error);
  }
});


router.post('/login', emailExist,async(req,res)=>{

  try {
    const {email,password} = req.body; 

    const userId = await UserModel.findOne({email: email});
    console.log(userId)
    if(userId){
    const token = jwt.sign({email: email, userId : userId._id}, SECRET as string,{expiresIn:"15m"});
     return res.json({
      message: "Login successful",
      token
    });
   }else{
    return res.status(400).json({ message: "User not found" });
   } 
    
  } catch (error) {
    res.status(500).json(error);
  }
});



export default router;