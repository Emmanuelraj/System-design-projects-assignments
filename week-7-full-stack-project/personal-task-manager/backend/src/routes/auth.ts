import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from 'bcryptjs'
import { authMiddleware } from "../middlewares/authMiddleware";
import dotenv from "dotenv";


dotenv.config();



const router = Router();
const prisma = new PrismaClient();
const rounds = 10;

const secret = process.env.secret;


const auth = new authMiddleware();

router.post('/signup',auth.userExist,async(req,res)=>{
    try {
        console.log("signup called")
        const {username, password, userId} = req.body;
        const hashedPassword = await bcrypt.hash(password, rounds);
    
        // Create one Task and push into DB
            const newUser =  await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    userId : userId
                }
        });

     res.status(201).json({
        message:"User created successfully",
        user:{
            id : newUser.userId,
            username: newUser.username
        }
     })  

    } catch (error) {
        res.status(500).json("signup routes error"+error);
    }
});


router.post('/login', auth.checkUserExists, async (req,res)=>{

    try {
        const {username, password, userId} = req.body;
            // Get one User
        const user = await prisma.user.findFirst({
        where: {
            username: username
        }
        })

       const token = jwt.sign({ username: user?.username, userId: user?.userId }, secret as string, { expiresIn: "4hr" });// generate a token
       res.json({ message: "Login successful", token });
       
    } catch (error) {
       res.status(500).json("login routes"+error);
    }
});



export default router