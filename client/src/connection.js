class Connection {
    /**
     * Game fires three different events:
     * fieldChosen(field, color): Fired when somebody chooses a field
     * gameStart(): Fired when the player has to start playing (not when the other player starts)
     * gameEnd(winner): When game ends: Winner can be: red, blue, none
     */
    socket: WebSocket;
    fieldChosen: function;
    gameEnd: function;
    gameStart: function;

    Connection() {
        this.socket = new WebSocket('wss://' + window.location.hostname + ':6300')
        this.socket.onmessage = this.handleIncomingMessage;
    }

    handleIncomingMessage(evt) {
        
    }

}
