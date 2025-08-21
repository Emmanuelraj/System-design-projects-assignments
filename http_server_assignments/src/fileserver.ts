import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs';

const app = express();

dotenv.config();
// body parse
app.use(express.json());

const port = process.env.PORT || 2000;

// list the no of files in directory
app.get("/files",  (req,res)=>{

  let fileNames:any = null;
  try {
  return new Promise((resolve,reject)=>{
  fileNames =  fs.readdir('./files', function(err, files){
      if(err){
        console.log(err)
        return reject('directory not found'+err.message);       
      }else{
            console.log(files);         
        }  
  });
 
  }).then((fileNames)=>{
     res.json({
    status: 200,
    files : fileNames
  });
  })  
  } catch (error) {
    res.json({
      status: 500,
      msg : error  
    })
  }  
});


app.post('/file', (req, res) => {
  try {
    const { filename } = req.query; // or req.body if client sends in body
    console.log("fileName: " + filename);

    new Promise((resolve, reject) => {
      fs.readFile("./files/" + filename, "utf-8", (err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    })
      .then((fileData) => {
        console.log(fileData);
        res.status(200).json(fileData);
      })
      .catch((err) => {
        console.error(err);
        res.status(404).json({
          status: 404,
          error: err.message,
        });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: error,
    });
  }
});



app.listen(port, ()=>{
  console.log(`server listen to port ${port}`);
});