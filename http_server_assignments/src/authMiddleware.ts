import { User } from "./auth.interface";
import {Request, Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';
import  express from 'express';

const app = express();
app.use(express.json());

dotenv.config();

const secret =  process.env.JWT_SECRET;

interface MyJwtPayload extends JwtPayload {
  username: string;
}

export class AuthMiddleware{

    users: User[];
    
    constructor(datastore: any){
      this.users = datastore;
      this.userExists = this.userExists.bind(this);
      this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    // login
  async userExists(req:Request, res: Response, next: NextFunction){
      
    try {
        const {username, password} = req.body;
        const plainTextPassword = password;
        const fetchedUser = this.users.find(user => user.username == username);
              
        if(fetchedUser){
          // compare 
          const flag:boolean =  await bcrypt.compare(plainTextPassword, fetchedUser.password as string); 
          if(flag){
            next()
          }else{
            res.send('password is mismatching please check');
          }
        }else{
          res.send("User not found");
        }
    } catch (error) {
        res.status(500).json({
          message: error
        })
    }
  }
  
  //isAuthenticated
  isAuthenticated (req:Request,res:Response,next:NextFunction){

    try {
    
      const token  = req.headers.authorization;      
      const decoded = jwt.verify(token as string, secret as string) as JwtPayload;

      if(decoded){
          (req as any).username = (decoded as any).username; // assign the username
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