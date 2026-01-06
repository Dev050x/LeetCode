import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
    program_id: string,
    socket: WebSocket,
};

const users: Users[] = [];


async function start_servie() {
    wss.on("connection", (ws) => {
        console.log("connection establish");
        ws.on("message", (msg) => {
            //@ts-ignore
            const msgObj = JSON.parse(msg);
            console.log("message received: ", msgObj);

            if (msgObj.type == "join") {
                let user = {
                    program_id: msgObj.payload.program_id,
                    socket: ws
                };
                users.push(user);
                console.log("user saved");
            }

            if (msgObj.type == "event") {
                console.log("event received");
                const user_program_id = msgObj.payload.program_id;
                console.log("program id: ", user_program_id);
                const user = users.find((user) => user.program_id === user_program_id);
                user?.socket.send(JSON.stringify({
                    program_id: user_program_id,
                    status: msgObj.payload.status
                }));
                console.log("solution send to the client");
            };

        });

    });

}


start_servie();