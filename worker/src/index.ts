import { createClient } from "redis";

const client = createClient();

async function process_submission(submission:any) {
    const submission_obj = JSON.parse(submission);
    console.log("processeing problem id:......", submission_obj.program_id);
    console.log("code:", submission_obj.code);
    console.log("language:", submission_obj.language);
    await new Promise(resolve => setTimeout(resolve, 1000));
    client.publish("problem_done", JSON.stringify({
        program_id: submission_obj.program_id,
        status: "TLE"
    }));
}   

async function startWorker() {
    try {
        await client.connect();
        console.log("connected to the redis");
        while(true) {
            try {
                const submission = await client.brPop("submissions", 0);
                console.log("submission received");
                await process_submission(submission.element);
                console.log("request processed...");
            } catch (error) {
                console.log("there is some error in processing", error);
            }

        }
    } catch (error) {
        console.log("there is some error in redis connection");
    }
}

startWorker();