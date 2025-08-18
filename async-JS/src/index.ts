//async
import fs from "fs";

fs.readFile("a.txt", "utf-8", (err, data)=>  {
  console.log("File content:", data);
});

console.log("hi there");


// async await 

function helloAsynFunction(){
  return new Promise(function(resolve,reject){
    // do some async logic there
    console.log("async Hello world");
    resolve("done");
  })
}


async function main(){
 const value =  await helloAsynFunction();
  console.log(value);
}

main();