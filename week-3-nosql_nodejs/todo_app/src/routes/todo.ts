import {Router} from 'express';
import { TodoModel, UserModel } from '../model/userModel';
import { isAuthenticated } from '../middlewares/todoMiddleware';

const router = Router();

router.post('/', isAuthenticated,async (req,res)=>{
  try {
    const {title} = req.body;
    const userId = (req as any).userId; 
    console.log('userId'+JSON.stringify(userId))
    console.log(userId);
    const todos = await TodoModel.create({
         title,
         done: false,
         userId: userId  
    })  
    res.status(200).json({
      todos
    })
  }catch(error){
    res.status(500).json({
    message: error
    });
  }
});

router.get('/', isAuthenticated, async(req,res)=>{
  try {
    const {title, done} = req.body;
    const userId = (req as any).userId;
    const todos = await TodoModel.findOne({userId: userId}); 
    res.status(200).json({
      "todos": todos
    }); 
  } catch (error) {
     res.status(500).json({
      message: error
    });
  }
});


export default router