const WebSocket = require('ws');
const https = require("https");
const fs = require("fs");

const server = https.createServer({
    cert: fs.readFileSync("/var/certs/rfGames/cert.pem"),
    key: fs.readFileSync("/var/certs/rfGames/privkey.pem"),
    port: 6300
})

const wss = new WebSocket.Server({ server });

wss.on('connection', async function connection(socket) {
    ws.on('message', function incoming(message) {});
});
