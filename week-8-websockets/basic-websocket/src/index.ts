import {WebSocketServer} from "ws"; 

const wss = new WebSocketServer({port: 8080});

//event handler similar like routes http since ws does not contains 
// websocket server responed
wss.on('connection', (socket) => {
  console.log('websocket server connected!');
  
  
  socket.on("message",(e)=>{
   if(e.toString() === "ping"){
     socket.send("pong");
   } 
  })
});