import {Router} from 'express'
import bcrypt from 'bcryptjs'
import { userExist } from '../middlewares/authMiddleware';
import { BlogMiddleware } from '../middlewares/blogMiddleware';
import { PrismaClient } from '../../generated/prisma';
const router = Router();

const prisma = new PrismaClient()


const blogMiddleware = new BlogMiddleware();


// add blog
// blogRoute.ts
router.post('/blog', blogMiddleware.userAuthenticated, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).userId; // from JWT payload

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Directly create blog without fetching user again
    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        userId
      }
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error: any) {
    // Handle unique title conflict or other DB errors
    if (error.code === 'P2002') { // Prisma unique constraint failed
      return res.status(400).json({ message: "Blog title already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.get('/blogs', blogMiddleware.userAuthenticated, async(req,res) =>{

  try {
    const userId = parseInt((req as any).userId); // from JWT payload
    const blogs =  await prisma.blog.findMany({
      where:{
         userId
      }
    })
    return res.status(201).json({
      blogs
    });
  } catch (error) {
      return res.status(500).json({ message: error }); 
  }

})

// edit
router.put('/:id', blogMiddleware.userAuthenticated, async(req,res)=>{

   try {
    const blogId = parseInt(req.params.id);
    const {title, description} = req.body;
    const blog =  await prisma.blog.findUnique({
      where:{
         blogId: blogId
      }
    });
    if(blog){
         const updatedBlog = await prisma.blog.update({
              where: {
                blogId
              },
              data: {
                title: title,
                description: description
              }
            })
    }
    return res.status(201).json(
      {
        msg : "Updated the blog"
      }); 
  } catch (error) {
      return res.status(500).json({ message: error }); 
  }

})

// delete
router.delete('/:id', blogMiddleware.userAuthenticated, async(req,res)=>{

   try {
    const blogId = parseInt(req.params.id);
    
    const blog =  await prisma.blog.findUnique({
      where:{
         blogId: blogId
      }
    });
    if(blog){
         const updatedBlog = await prisma.blog.delete({
              where: {
                blogId
              }
            })
    }else{
      res.send("blog not found");
    }
    return res.status(201).json(
      {
        msg : "Updated the blog"
      }); 
  } catch (error) {
      return res.status(500).json({ message: error }); 
  }

})


export default router