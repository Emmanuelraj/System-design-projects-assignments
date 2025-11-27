import { createClient } from "redis";

const client = createClient();



async function worker(){
    const connect = await client.connect();

    // we are blocked
    while(1){
        // transcript
        const response = await client.brPop("submission",0);  
        
        console.log(response);
        
        // call the open AI call am i right
        await new Promise((resolve)=> setTimeout(resolve, 1000));

        //
        console.log("Processed your submission")
    }
}


worker();