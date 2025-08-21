import express  from "express";
import dotenv from 'dotenv';
import { TodoMiddleware } from "./todoMiddleware";
import { Todo } from "./todo.interface";

dotenv.config();
const app = express();

const port = process.env.PORT || 2000;
// supporting body
app.use(express.json());

 //in-memory
let todos: Todo[] = [];
const todoMiddleware = new TodoMiddleware(todos);

app.get('/todos', (req,res)=>{
  try{
    if(todos.length===0){
      res.status(200).json({
    "message":"No todos"
    });
  }else{
  res.status(200).json({ 
    todos
  });
  }
  }catch(err){
     res.status(500).json({err})
  }
})


app.get('/todos/:id', (req,res)=>{
 try {
  const {id} = req.params;
  res.status(200).json(todos.map(todo =>{
    todo.id === parseInt(id)
  }));
 } catch (error) {
  
 }
  
});


app.post('/todos', (req,res)=>{
  try {
  const {title, isCompleted} = req.body;
  const newTodo = {
       id: todos.length+1,
       title,
       isCompleted
  };

  // push into existing 
  todos.push(newTodo);

  res.json({
     status: 200,
     todos
  })
  } catch (error) {
    res.status(500).json({
      error 
    })
   }
});

app.put('/todos/:id',todoMiddleware.checkTodoExists,(req,res)=>{
 // since the middleware already exist or not 
  try {
    const {id} = req.params
    const {title, isCompleted} = req.body;
   const idx =  todos.findIndex(todo => todo.id === parseInt(id));

   if(idx!=-1){
    todos[idx].title = title;
    todos[idx].isCompleted = isCompleted
   }

   res.status(200).json({
     msg: `${id} is updated in todo`
   });
  } catch (error) {
    res.status(500).json({error});
  }

});


app.delete('/todos/:id',todoMiddleware.checkTodoExists, (req,res)=>{
  try {
  const {id} = req.params
    const {title, isCompleted} = req.body;
    todos = todos.filter(todo => todo.id !== parseInt(id));
   res.status(200).json({
     msg: `${id} is deleted in todo`
   });
  } catch (error) {
    res.status(500).json({error});
  }
});



app.listen(port, ()=>{
  console.log(`server listen to the port ${port}`)
});