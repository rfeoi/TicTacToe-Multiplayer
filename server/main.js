const WebSocket = require('ws');
const https = require("https");
const fs = require("fs");
const game = require('./game.js');

const server = https.createServer({
    cert: fs.readFileSync("/var/certs/rfGames/cert.pem"),
    key: fs.readFileSync("/var/certs/rfGames/privkey.pem")
});

const wss = new WebSocket.Server({ server });

let games = [];


function getGame(code) {
    if (games[code]) {
        return games[code];
    } else {
        games[code] = new game.Game();
        return getGame(code);
    }
}

wss.on('connection', async function connection(ws, req) {
    ws.sendFieldChose = (row, col, color) => {
        ws.send("chosen:" + row + ","  + col + "," + color);
    };

    ws.sendGameEnd = (winner) => {
        ws.send("end:" + winner);
    };

    ws.sendGameStart = () => {
        ws.send("start:");
    };

    ws.sendJoined = () => {
        ws.send("joined:")
    };

    // Initialize
    ws.on('message', (message) => {
        console.log(req.connection.remoteAddress + " -> " + message);
        if (message.includes(':')) {
            let param = message.split(":")[1];
            switch(message.split(':')[0]) {
                case "join":
                    if (param.includes(",")) break;
                    if (ws.game) {
                        ws.game.playerLeft(ws);
                    }
                    ws.game = getGame(param);
                    if (ws.game.isGameFull()) {
                        ws.game = undefined;
                        break;
                    }
                    ws.game.playerJoined(ws);
                    break;
                case "choose":
                    if (!ws.game) return;
                    if (param.includes(',') && param.split(",").length === 2) {
                        let row = parseInt(param.split(',')[0]);
                        let col = parseInt(param.split(',')[1]);
                        ws.game.setField(row, col, ws.game.getColorOfPlayer(ws))
                    }
                    break;
            }
        }
    });
});

server.listen(6300);
