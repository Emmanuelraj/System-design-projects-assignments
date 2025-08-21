/**Input: JSON body, e.g., { "username": "user", "password": "secret123" }.



Output: JSON, e.g., { "token": "jwt.token.here" } (200 OK) or { "message": "Invalid credentials" } (401 Unauthorized).
*/

import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from './auth.interface';
import bcrypt from 'bcrypt';
import { AuthMiddleware } from './authMiddleware';

dotenv.config();

const app = express();
app.use(express.json());

//port no
const PORT = process.env.PORT || 2500;
//JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET 
//In -Memory
let users: User[] = [];

const saltRounds:number = 10;

const authMiddleware:AuthMiddleware = new AuthMiddleware(users);

app.post('/signup', async (req, res)=>{
     
   try {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
   
    const newUserData = {
      username: username,
      password: hashedPassword
    }
    users.push(newUserData);
  
     res.status(201).json({ message: "User created successfully", user: newUserData });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// TODO: Create POST /login endpoint
// Check username/password, generate JWT if valid, else 401
// Return 404 for undefined routes
app.post('/login', authMiddleware.userExists, (req, res)=>{
     
   try {
      const {username, password} = req.body;
      // payload we are giving username
      const token  =  jwt.sign({username}, JWT_SECRET as string,{expiresIn:"15m"}) // it will generate a token    
     return res.json({
      message: "Login successful",
      token
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/users', authMiddleware.isAuthenticated,(req,res)=>{

  try {
    res.status(200).json({ msg : "you successfully loggedIn"});
  } catch (error) {
    res.status(500).json({ msg : error});
  }

})




app.listen(PORT, ()=>{
  console.log(`server listen to the port no ${PORT}`);
})










