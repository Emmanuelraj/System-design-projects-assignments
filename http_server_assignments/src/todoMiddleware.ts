import { Request,Response, NextFunction } from "express";
import { Todo } from "./todo.interface";


export class TodoMiddleware{
  
  todos: Todo[];

  constructor(datastore:any){
    this.todos = datastore;
    console.log(`MyMiddleware initialized ${datastore}`);
    this.checkTodoExists = this.checkTodoExists.bind(this);
  }

  checkTodoExists(req:Request,res:Response,next:NextFunction){
    
    const {id} = req.params;
    const exists = this.todos.some(t=>t.id ===parseInt(id)); 

    if(exists){
      next();
    }else{
      res.status(404).json({
        message: "Todo not found"
      })
    }

  }
  
}


