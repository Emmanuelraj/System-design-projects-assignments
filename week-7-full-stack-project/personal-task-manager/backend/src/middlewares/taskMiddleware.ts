import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken"

dotenv.config();

const secret = process.env.secret

export class taskMiddleware{



    constructor(){

        this.userAuthenticated.bind(this);
    }

    async userAuthenticated(req:Request, res:Response, next : NextFunction){

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "No token provided" });
            }

             const token = authHeader.startsWith("Bearer ")
                                ? authHeader.split(" ")[1]
                                : authHeader;
                                
            if (!token) {
                return res.status(401).json({ message: "Token missing" });
            }

            // verify
            const decoded = jwt.verify(token,secret as string) as JwtPayload
            
            if (!decoded || !decoded.userId || !decoded.username) {
                return res.status(401).json({ message: "Invalid token" });
            }

             // Assign values to request
            (req as any).userId = decoded.userId;
            (req as any).username = decoded.username;

        
           next()
        } catch (error) {
            
        }
    }
}