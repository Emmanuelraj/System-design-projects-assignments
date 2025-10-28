// importing the WebSocketServer
import {WebSocketServer} from "ws"

// websocketerver listening to the port of 3000
const ws = new WebSocketServer({port:3000});


// 1️⃣ Event: Fired when a client successfully establishes a WebSocket connection
ws.on("connection",(socket)=>{

    console.log("websocket Persistent connection established ");

     // 2️⃣ Event: Fired whenever this specific client sends a message
    socket.on("message",(e)=>{

        if(e.toString().toLowerCase()==="ping"){
           
            socket.send("pong from server");
        }
    })

})