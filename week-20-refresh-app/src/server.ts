import express, { type NextFunction, type Request, type Response } from "express";

const app = express();


app.use(express.json());

const PORT = 3000;

const pingMiddleware = async (req:Request,res:Response, next:NextFunction)=>{
    console.log("pingMiddleware");
    next();
}

app.get("/items",pingMiddleware,async(req:Request,res:Response)=>{  
   res.send("items");
});


app.post('/items/:id', async(req:Request,res:Response)=>{  
   const body = req.body ;
   //res.send("items"+req.params.id as string);
   res.json({ message: "Backend working!",
              items : req.params.id as string,
              data : body     
    });
});
//http://localhost:3000/Hello/123?limit=10&que=2
app.get('/Hello/:id', async(req:Request,res:Response)=>{  
   console.log(req.query); 
   res.send("limits"+req.params.id+""+req.query.limit as string);
});

app.listen (PORT, ()=>{
    console.log(`server listening to the port ${PORT}`)
})