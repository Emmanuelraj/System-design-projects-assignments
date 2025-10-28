import {WebSocketServer} from "ws";

// Create a WebSocket server instance listening on port 3000
const ws = new WebSocketServer({port:3000});

// 1️⃣ Event: Fired when a client successfully establishes a WebSocket connection
ws.on("connection",(socket)=>{

    console.log("websocket Persistent connection established ");
      
      // 2️⃣ Event: Fired whenever this specific client sends a message
    socket.on("message",(e)=>{
         // If client sends 'echo', respond back to confirm two-way communication
         if(e.toString().toLowerCase()==="echo"){
             socket.send("echo back from server");
         }
    })

})