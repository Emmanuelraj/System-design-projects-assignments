import { WebSocketServer } from "ws";

const ws = new WebSocketServer({port:3000});



ws.on("connection",(socket)=>{

    console.log('websocket server connected!');
  
  
  socket.on("message",(e)=>{
   if(e.toString() === "echo"){
     socket.send("echo");
   } 
  })


})