import express, { json } from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());
const redis_client = createClient();
redis_client.on("error" , (err) => console.log("redis client error: ", err));

async function startServer() {
    try {
        await redis_client.connect();
        console.log("redis client connected");
    
        app.listen(3000, () => {
            console.log("server is listening");
        });
    } catch (error) {
        console.log("there is some error with the redis client", error);
    }
};



startServer();