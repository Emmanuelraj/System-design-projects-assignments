import express, { Request, Response } from "express"
import  {createClient} from "redis";

const app = express();

app.use(express.json());


const client = createClient();
client.connect();


app.post('/submit', async (req:Request, res:Response)=>{

    try {
    
        const {problemId, userId, code, lang} = req.body;

        await client.lPush("submission",JSON.stringify({problemId,userId, code, lang}));

        res.json({
            message:"Submission received"
        });
    } catch (error) {
        res.status(500).json(error);
    }

})



app.listen(3000)