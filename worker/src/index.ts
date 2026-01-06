import { createClient } from "redis";

const client = createClient();

async function process_submission(submission:any) {
    const submission_obj = JSON.parse(submission);
    console.log("processeing problem id:......", submission_obj.program_id);
    console.log("code:", submission_obj.code);
    console.log("language:", submission_obj.language);
    return new Promise(resolve => setTimeout(resolve, 1000));
}

async function startWorker() {
    try {
        await client.connect();
        console.log("connected to the redis");
        while(true) {
            try {
                const submission = await client.brPop("submissions", 0);
                console.log("submission received", submission);
                await process_submission(submission);
            } catch (error) {
                console.log("there is some error in processing", error);
            }

        }
    } catch (error) {
        console.log("there is some error in redis connection");
    }
}

