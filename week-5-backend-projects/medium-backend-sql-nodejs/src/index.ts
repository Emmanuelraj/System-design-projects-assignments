import express from 'express'
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";

dotenv.config();
const app = express();
app.use(express.json());


const PORT = process.env.PORT  || 2000


app.use('/users/v1', userRoutes);
app.use('/users/v1', blogRoutes);



app.listen(PORT, ()=>{
    console.log(`server listen to the port ${PORT}`)
})
