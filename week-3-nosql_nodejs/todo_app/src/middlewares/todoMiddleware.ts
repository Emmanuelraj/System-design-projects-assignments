import {Request, Response,NextFunction } from "express";
import express from "express";
import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv";
const app = express();

app.use(express.json());
dotenv.config();
const SECRET = process.env.CLIENT_SECRET

async function isAuthenticated(req:Request,res:Response,next:NextFunction) {
  
  try {
    const {authorization} = req.headers;

    // fetching the token 
    const decoded  = jsonwebtoken.verify(authorization as string, SECRET as string);

    // assign that email 
      console.log("decoded"+JSON.stringify(decoded));

      if(decoded){
          (req as any).email = (decoded as any).email; // assign the username
         (req as any).userId = (decoded as any).userId;

          console.log("Auth OK:", (req as any).email, "-->", (req as any).userId);
          next();// ✅ pass to the next handler
         
      }
      else{
         res.send("Unauthorized user please login again");
      }

    
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
}


export {
  isAuthenticated
}