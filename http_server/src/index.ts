import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT  = process.env.PORT || 4000;
// body parser
app.use(express.json());




app.get("/get",  (req,res)=>{
  res.send("Hello world");
});

app.post("/post",  (req,res)=>{
  
  const query = req.query;
  const msg = req.body.message;

  console.log(query.message+"query b value"+query.b+"message"+JSON.stringify(msg));

  res.send("post ")


});



app.listen(PORT, ()=>{
  console.log(`server listening to this port no ${PORT}`);
})