import {Router} from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../../generated/prisma'; 
import jwt from "jsonwebtoken"
import { userExist } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

const jwt_secret = process.env.JWT_SECRET as string

const saltRound = 10;

router.post('/signup' ,async(req, res)=>{
   try {
    const {userName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    await prisma.user.create({
      data: {
          username: userName,
          password: hashedPassword
      }
    })
   
    res.send ("User successfully created");

   }catch (error) {
     res.status(500).json({
      msg: error
     })       
   }
});


// Login route

router.post('/login', userExist, async(req,res)=>{

  try {
    const {userName, password } = req.body;
    // Get one User
    const user = await prisma.user.findUnique({
      where: {
        username: userName
      }
    })
    //  const token = jwt.sign(
    //   { username: userName, userId: user.userId },
    //   secret,
    //   { expiresIn: "1hr" }
    // );
    const token = jwt.sign({ username: userName, userId : user?.userId }, jwt_secret, { expiresIn: "4hr" });// generate a token
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({
      message:error
    })
  }

})


export default router