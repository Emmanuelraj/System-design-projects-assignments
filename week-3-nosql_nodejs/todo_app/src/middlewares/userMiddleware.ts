import express, { Request,Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { UserModel } from '../model/userModel';
import bcrypt from "bcrypt";


const app = express();

app.use(express.json());



async function emailExist(req:Request, res: Response, next:NextFunction) {

  try {
    const {name, email, password} = req.body; 
    const value = await UserModel.findOne({email:email});
    
    if(value===null){
      res.status(401).json({message:"Email not exists Unathorized"});   
    }else{
      const hashedPassword = value.password;
      const result = await bcrypt.compare(password,  hashedPassword as string); 
      if(result)
      {
        next();
      }else{
        res.status(403).json({
          message : "Invalid Credientials"
        });
      }
    }
    
  } catch (error) {
    res.status(500).json({msg: error})
  }
}


export {
  emailExist
}