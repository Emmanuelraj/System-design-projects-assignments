import { PrismaClient } from '../../generated/prisma'; 
import { Router } from "express";
import { authMiddleware } from '../middlewares/authMiddleware';
import { taskMiddleware } from '../middlewares/taskMiddleware';


const router = Router();
const prisma = new PrismaClient()

const task = new taskMiddleware();

router.post('/',task.userAuthenticated, async (req,res)=>{
  try {   
    
    // Get one Task
    // Get one Task
    const userId = (req as any).userId; // from JWT payload
    const username = (req as any).username;
    const {title, description} = req.body;

    const Task = await prisma.task.create({
                            data: {
                              userId,
                              title,
                              description
                          }});


 return res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error: any) {
    // Handle unique title conflict or other DB errors
    if (error.code === 'P2002') { // Prisma unique constraint failed
      return res.status(400).json({ message: "Task  already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
})


router.get('/', task.userAuthenticated,async(req,res)=>{
   try {
  const userId = (req as any).userId; // from JWT payload
    const task = await prisma.task.findMany({
      where: {
        userId : userId
      }
    });
    res.status(200).json(task);
  } catch (error) {
   res.status(500).send("error message"+error);
  }    
});


router.get('/hello', (req,res)=>{
   res.json({ message: "hello" });  // ✅ send JSON
});



export default router