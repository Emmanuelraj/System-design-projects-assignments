
import { Request,Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcryptjs"

export class authMiddleware{



  constructor(){
    this.userExist =  this.userExist.bind(this); 
    this.checkUserExists = this.checkUserExists.bind(this); 
  }

    async userExist(req:Request, res: Response, next:NextFunction){
        try {
            const {username}= req.body;
            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
            where: {
               username : username  
            }
            })
            console.log(user);
          if (user) {
            return res.status(409).json({ error: "User already exists" });
      }
         // If user does not exist → move to signup logic
         next()
        } catch (error) {
              return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async checkUserExists(req:Request, res:Response, next:NextFunction){

       try {
            const {username, password}= req.body;
            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
            where: {
               username : username  
            }
            })
          if (!user) {
            return res.status(409).json({ error: "User not exists" });
          }
          if(user){
            
            const flag = await bcrypt.compare(password, user.password)
            if(flag===false){
              res.send("password is wrong");
            }else{          
              next();
            }
          }
    
        } catch (error) {
              return res.status(500).json({ error: "Internal Server Error" });
        }

    }



}
  
 
