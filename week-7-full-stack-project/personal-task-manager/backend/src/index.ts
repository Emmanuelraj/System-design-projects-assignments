import express from 'express'
import dotenv from 'dotenv'
import taskRouter from './routes/tasks';
import authRouter from './routes/auth'; 
import cors from "cors";



const app = express();

app.use(express.json());

 // Use the cors middleware
    app.use(cors());

dotenv.config()
const port =  process.env.port || 3000


// routes
app.use('/api/tasks', taskRouter);
app.use('/api/tasks/auth', authRouter)






app.listen(port, ()=>{
    console.log(`server listen to the port ${port}`);
})

