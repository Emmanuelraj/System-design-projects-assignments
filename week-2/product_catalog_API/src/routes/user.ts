import { Router } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "../middlewares/authMiddleware";

dotenv.config();

const router = Router();
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET as string;
const saltRounds = 10;

const authMiddleware = new AuthMiddleware();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { username: userName, password: hashedPassword },
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", authMiddleware.userExists, async (req, res) => {
  try {
      const { userName } = req.body;
 
      const user = await prisma.user.findUnique({
      where: {
        username : userName
      }
    })
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign(
      { username: userName, userId: user.userId },
      secret,
      { expiresIn: "1hr" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
