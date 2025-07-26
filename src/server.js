
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

let lastGameState = JSON.stringify({
    history: [Array(9).fill(null)],
    currentMove: 0,
});

console.log('WebSocket server started over port 8080');

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected. Total:', clients.size);

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(lastGameState);
    }

    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log('Message received, retransmitting to all clients:', messageString);

        lastGameState = messageString;

        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconected. Total:', clients.size);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});
