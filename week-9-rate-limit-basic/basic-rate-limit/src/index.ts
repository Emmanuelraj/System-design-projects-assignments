import express, { Request, Response } from "express";
import dotenv from "dotenv";
import IORedis from "ioredis";

const app = express();
dotenv.config();

const redis = new IORedis();// connects to localhost:6379 by default
const PORT = process.env.PORT || 4000
const noOfReqPerMin = 3;
let count  = 0;


// when user continously calling this api we should give 429
app.get("/api/rate-limit", async(req:Request,res: Response)=>{

    try {

        const value = await redis.get("testkey");
        // get the ip address
        const ip = (req.headers["x-forwarded-for"] || req.ip) as string;
        //set the TTL  
        /** 
            | Redis Key          TTL    |
            | -----------------  ------ |
            | `rate-limit:<IP>`  60 sec |
        */
        const redisKey = "rate-limit:"+ip;
        // increment the counter for this IP
        const currentCount = await redis.incr(redisKey);

        if(currentCount >noOfReqPerMin){
                //Exceeded rate limit
             return res.status(429).json({
                    msg: "exceeded Rate limit",
                });    
        }else{
             // this will run 1st time and set the expire
             if(currentCount === 1){
                await redis.expire(redisKey, 60) // set expire for 60 seconds 
             }
             // Within limit → just respond
            res.send("RateLimit");
        }
        
    } catch (error) {
        res.status(500).json({
            "error":"error"
        });   
    } 
});





app.listen(PORT, ()=>{
    console.log(`server listen to the port ${PORT}`);
});