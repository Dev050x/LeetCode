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

app.post("/submit", async (req , res) => {
    const {program_id, code, language} = req.body;
    console.log(`program id: ${program_id}, code: ${code}, language: ${language}`);

    try {
        await redis_client.lPush("submissions", JSON.stringify({program_id, code, language}));
        res.status(200).send("submission received");
    } catch (error) {
        console.log("there si some error in submission", error);
    }

});




startServer();