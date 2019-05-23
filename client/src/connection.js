class Connection {
    /**
     * Game fires three different events:
     * fieldChosen(row, col, color): Fired when somebody chooses a field
     * gameStart(): Fired when the player has to start playing (not when the other player starts)
     * gameEnd(winner): When game ends: Winner can be: red, blue, none
     * gameJoined: When Game is succesfully joined
     */
    socket: WebSocket;
    fieldChosen = function(row, col, color){};
    gameEnd = function (winner) {};
    gameStart = function () {};
    gameJoined = function () {};

    constructor() {
        this.socket = new WebSocket('wss://' + window.location.hostname + ':6300');
        this.socket.onmessage = this.handleIncomingMessage;
    }

    handleIncomingMessage(evt) {
        let msg = evt.data;
        if (msg.includes(':')) {
            let parameter = msg.split(':')[1];
            switch (msg.split(':')[0]) {
                case 'chosen':
                    if (parameter.includes(',') && parameter.split(',').length === 3) {
                        window.connection.fieldChosen(parameter.split(',')[0], parameter.split(',')[1], parameter.split(',')[2]);
                    }
                    break;
                case 'start':
                    window.connection.gameStart();
                    break;
                case 'end':
                    if (parameter.includes(',')) break;
                    window.connection.gameEnd(parameter);
                    break;
                case 'joined':
                    window.connection.gameJoined();
                    break;
            }
        }
    }

    choose(row, col) {
        this.socket.send('choose:' + row + ',' + col);
    }

    join(game) {
        this.socket.send('join:' + game);
    }

}
