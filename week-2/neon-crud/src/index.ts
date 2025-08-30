import express from 'express'
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv'

dotenv.config();
const app = express();


const PORT = process.env.PORT || 2000
app.use(express.json());

const prisma =  new PrismaClient();

// Create todo
app.post('/todo', async (req,res)=>{

  const { title, desc } = req.body;
  const todo = await prisma.todo.create({ data: { title:"task1", desc:"GotoGym" } });
  res.json(todo);
});

// Read All
app.get('/todos', async (req,res)=>{
  try {
    // Get All todos
    const todos =  await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
     res.status(500).json({message:error})   
  }
})

// Read One
app.get('/todo/:id', async (req,res)=>{
  try {
    const todoId = req.params.id;
    const todoById = await prisma.todo.findUnique({where: {todoId : Number(todoId)}});
    res.json(todoById); 
  } catch (error) {
     res.status(500).json({message:error})   
  }
});
// update
app.put('/todo/:id', async(req,res)=>{
  try {

    const todoId = req.params.id;
    const {title, desc} = req.body;
    const todo = await prisma.todo.update({
    where: { todoId: Number(todoId) },
    data: { title, desc },
  });
  res.json(todo);
  } catch (error) {
     res.status(500).json({message:error})   
  }
})



// Delete By Id
app.delete('/todo/:id', async(req,res)=>{
    try {
     // Delete one Todo
    const Todo = await prisma.todo.delete({
      where:{
        todoId: Number(req.params.id)
      }
    })
    res.send("record deleted");
    } catch (error) {
        res.status(500).json({message:error})      
    }   
})






app.listen(`${PORT}`, ()=>{
  console.log(`server listsen to this port ${PORT}`);
})