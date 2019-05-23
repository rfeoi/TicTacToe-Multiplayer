exports.BLUE = 1;
exports.RED = 2;

exports.Game = class Game {

    clear() {
        this.field = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                this.players.forEach((player) => player.sendFieldChose(row, col, 0))
            }
        }
    }

    isFieldFree(row, col) {
        return this.field[row][col] === 0;
    }

    checkFieldFull() {
        let full = false;
        this.field.forEach((row) => row.forEach((col) => col !== 0 ? full = true : undefined));
        return full;
    }

    changePlayerTurn() {
        switch (this.playersTurn) {
            case exports.BLUE:
                this.playersTurn = exports.RED;
                break;
            case exports.RED:
                this.playersTurn = exports.BLUE;
                break;
        }
    }

    setField(row, col, player) {
        if (this.playersTurn === player) {
            if (this.isFieldFree(row, col)) {
                this.field[row][col] = player;
                this.players.forEach(oPlayer => oPlayer.sendFieldChose(row, col, player));
                if (!this.winCheck(this.playersTurn)) {
                    this.changePlayerTurn();
                }
            }
        }
    }

    getColorOfPlayer(ws) {
        return this.players.indexOf(ws);
    }

    playerJoined(ws) {
        if (this.isGameFull()) return;
        if (this.players[exports.BLUE]) this.players[exports.RED] = ws;
        else this.players[exports.BLUE] = ws;

        if (this.isGameFull()) {
            this.players[exports.BLUE].sendGameStart();
            this.playersTurn = exports.BLUE;
        }
    }

    playerLeft(ws) {
        this.players = this.players.filter(e => e !== ws);
        this.players.forEach(player => player.sendGameEnd(this.getColorOfPlayer(player)));
        this.clear();
        this.playersTurn = 0;
    }

    isGameFull() {
        // Three needed here because of empty 0
        return this.players.length >= 3;
    }

    playerOwns(row, col, player) {
        return this.field[row][col] === player;
    }

    winCheck(player) {
        let win = false;
        if (this.playerOwns(0,0,player) && this.playerOwns(0,1,player) && this.playerOwns(0,2,player)) win = true;
        if (this.playerOwns(1,0,player) && this.playerOwns(1,1,player) && this.playerOwns(1,2,player)) win = true;
        if (this.playerOwns(2,0,player) && this.playerOwns(2,1,player) && this.playerOwns(2,2,player)) win = true;
        if (this.playerOwns(0,0,player) && this.playerOwns(1,0,player) && this.playerOwns(2,0,player)) win = true;
        if (this.playerOwns(0,1,player) && this.playerOwns(1,1,player) && this.playerOwns(2,2,player)) win = true;
        if (this.playerOwns(0,2,player) && this.playerOwns(1,2,player) && this.playerOwns(2,1,player)) win = true;
        if (this.playerOwns(0,0,player) && this.playerOwns(1,1,player) && this.playerOwns(2,2,player)) win = true;
        if (this.playerOwns(0,2,player) && this.playerOwns(1,1,player) && this.playerOwns(2,0,player)) win = true;
        if (win) {
            this.won(player);
            return true;
        }
        //else if (this.checkFieldFull()) {
        //    this.won(0);
        //}
        return false;
    }

    won(player) {
        let playerName = (player + "").replace((exports.BLUE + ""), "Blue").replace((exports.RED + ""), "Red").replace((0 + ""), "Nobody");
        this.players.forEach(player => player.sendGameEnd(playerName));
        this.clear();
        setTimeout(() => {
            if (player !== 0) {
                this.playersTurn = player;
            } else {
                this.playersTurn = exports.BLUE;
            }
            this.players[player].sendGameStart();
        })
    }

    constructor() {
        this.playersTurn = 0;
        this.players = [];
        this.clear();
    }


};
