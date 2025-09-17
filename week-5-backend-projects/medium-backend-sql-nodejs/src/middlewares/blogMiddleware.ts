import { NextFunction, Request, Response } from "express"
import express from 'express'
import { PrismaClient } from "../../generated/prisma";
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv"


const app = express();
app.use(express.json());
const prisma = new PrismaClient();
dotenv.config();
const jwt_secret = process.env.JWT_SECRET as string;



export class BlogMiddleware{



    constructor(){
       this.userAuthenticated = this.userAuthenticated.bind(this);
    }


   async  userAuthenticated(req:Request, res: Response, next:NextFunction){
   try {
     const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Support both "Bearer <token>" and just "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, jwt_secret) as JwtPayload;

    if (!decoded || !decoded.userId || !decoded.username) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Assign values to request
    (req as any).userId = decoded.userId;
    (req as any).username = decoded.username;

    console.log("JWT decoded:", decoded);
    console.log("Assigned userId:", (req as any).userId);
    console.log("Assigned username:", (req as any).username);

    next(); // Pass control to the next middleware / route handler
  } catch (error: any) {
    console.error("JWT auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized user, please login again", error: error.message });
  }
}

  
}





