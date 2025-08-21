// using JWT

import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request,Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
const app = express();
dotenv.config()
const port = process.env.PORT ;
const secret = "secret";

app.use(express.json());


const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];


interface MyJwtPayload extends JwtPayload {
  username: string;
}

const checkUserExists =  async (req:Request, res:Response, next:NextFunction)=>{
         
  console.log("Hello middlewaree")
   try {
    const {username} = req.body;
    console.log("body"+JSON.stringify(req.body))
    const indexValue = ALL_USERS.findIndex(allUser=> allUser.username === username);
    console.log("indexvalue"+indexValue)
    if (indexValue !== -1){
      console.log("this place or not")
     next();     
    }else{
      res.send('Username not exists');
    }
  } catch (error) {
    res.status(500).json(error);
   }   
}

app.post('/signin', checkUserExists,async (req,res)=>{
  const {username, password} = req.body;
  console.log('back to the route')
  const token = jwt.sign({ username }, secret, { expiresIn: "1h" });// generate a token
  return res.json({
    token
  }); 
  //return json web token with username encrypted
});



app.get('/users',  (req,res)=>{
  const token = req.headers.authorization;


  try {
    const decodedData = jwt.verify(token as string, secret) as JwtPayload;
   
   res.send(decodedData.username);

   if(decodedData){
     (req as any).username = (decodedData as any).username; // assign the username
   }
    
  } catch (error) {
    
  }
});



app.listen(port, ()=>{
console.log(`server listen to this port ${port}`)
});