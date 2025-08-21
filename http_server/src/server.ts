import express from 'express';
import dotenv from 'dotenv';



const app = express();
// for body parser
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 5000;


let users = [{
  name :"Alice",
  kidneys:[{
    healthy: false
  },{
    healthy: true
  }]
}]




app.get("/", (req,res)=>{

  const userKidneys = users[0].kidneys;
  const countNoOfKidneys = userKidneys.length;
  let noOfHealthyKidneys = 0;
    for(let i =0;i<userKidneys.length;i++){
          if(userKidneys[i].healthy===true){
            noOfHealthyKidneys++;
          }         
     }
    const noOfFailureKidneys  = countNoOfKidneys-noOfHealthyKidneys;
    console.log("noOfFailureKidneys   "+noOfFailureKidneys+"noOfHealthyKidneys  "+noOfHealthyKidneys);

    res.json({
      countNoOfKidneys,
      noOfHealthyKidneys,
      noOfFailureKidneys
    });
});


app.post("/", (req,res)=>{

  const isHealthy = req.body.isHealthy;
  console.log(isHealthy);

  users[0].kidneys.push({
    healthy: isHealthy
  })

  res.json({
    msg:"Done"
  })
});


app.put("/", (req,res)=>{

});


app.delete("/", (req,res)=>{

});


app.listen(port, ()=>{
  console.log(`server listen to this port${port}`);
})