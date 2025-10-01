import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();



app.use(express.json());

// Create Post
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const post = await prisma.post.create({
    data: { title, content },
  });
  res.json(post);
});



// Read All Posts
app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.delete('/posts', async(req,res)=>{
  await prisma.post.update
  res.send("posts") 
})



app.listen(PORT, ()=>{
  console.log(`server listen to port no ${PORT}`);
})