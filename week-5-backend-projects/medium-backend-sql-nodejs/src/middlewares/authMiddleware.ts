import { NextFunction, Request, Response } from "express"
import express from 'express'
import { PrismaClient } from "../../generated/prisma";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from "dotenv"


const app = express();
app.use(express.json());
const prisma = new PrismaClient();
dotenv.config();
const jwt_secret = process.env.JWT_SECRET as string;

async  function userExist(req : Request,res : Response,next : NextFunction){

    try {
        const {userName, password} = req.body;
        console.log("checking the userExist or not");
        const user = await prisma.user.findUnique({
            where: {
               username : userName  
            }
            })
         if (!user) return res.status(404).json({ error: "User not found" });
         
         if(user){
            const hashedPassword = user.password
            const flag = await bcrypt.compare(password, hashedPassword);
            if(!flag){
                    res.status(403).json({
                        msg: "User doesn't exist in DB"
                    });
            }else{
              next()

            }
        }
       
    } catch (error) {
        
    }
}


export {
    userExist
}