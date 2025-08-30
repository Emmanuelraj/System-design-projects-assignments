import {Request, Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
import  express from 'express';
import { PrismaClient } from '../../generated/prisma';

const app = express();
app.use(express.json());

dotenv.config();

const prisma = new PrismaClient();

const secret  = process.env.JWT_SECRET

export class AuthMiddleware{

  
  

  constructor(){
     this.userExists.bind(this);
     this.authenticateToken.bind(this);
  }

  // login
  async userExists(req: Request, res: Response, next: NextFunction){

    try {
      const {userId, userName, password} = req.body;
      const plainTextPassword = password;
      // Create one User
      const User =  await prisma.user.findUnique({
          where: {
            username : userName
          }
      });

      if(User){
      const flag = await bcrypt.compare(plainTextPassword, User?.password as string);
         if(flag){
           next()
      }else{
         res.send('password is mismatching please check');
      }
      }else{
        res.send('User not found');
      }
    } catch (error) {
      res.status(500).json({message : error})
    }

  }


  async authenticateToken(req:Request, res:Response,next:NextFunction){

    try {
      const token  = req.headers.authorization;

      const decoded =  jwt.verify(token as string, secret as string) as JwtPayload;

      console.log(decoded);

      if(decoded){
          (req as any).username = (decoded as any).username; // assign the username
          (req as any).userId = (decoded as any).userId;
 
          console.log("if part"+(req as any).username+"userId"+ (req as any).userId)
          next();
      }
      else{
         res.send("Unauthorized user please login again");
      }

    } catch (error) {
       res.status(500).json({
        "message": error
      })
    }
  }

}
