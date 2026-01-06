import { createClient  } from "redis";
const redis_client = createClient();
const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
    subscriber();
};

ws.onclose = async () => {
    console.log("websocket connection lost");
    await redis_client.unsubscribe("problem_done");
    await redis_client.quit();
    return;
}

async function subscriber() {
    await redis_client.connect();
    console.log("redist client connected");
    await redis_client.subscribe("problem_done", (data) => {
        const data_obj = JSON.parse(data);
        console.log("pub sub received problem: ", data_obj.program_id );
        ws.send(JSON.stringify({
            type: "event",
            payload: {
                program_id: data_obj.program_id,
                status: data_obj.status,
            }
        }));
        console.log("data send to the websocket server");
    });

}

