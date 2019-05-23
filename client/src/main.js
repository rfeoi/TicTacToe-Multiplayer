let game = document.getElementById('game').querySelectorAll('tr');
let connection: Connection = new Connection();
let turn: boolean = false;

function showMessage(messageText, time = 1000) {
    let message = document.getElementById("message");
    message.innerText = messageText;
    setTimeout(() => {
        message.innerText = '';
    }, time)
}

document.getElementById('idSubmit').onclick = () => {
    connection.join(document.getElementById('id').value);
};

connection.fieldChosen = function(row, col, color) {
    color = parseInt(color);
    let node = game[row].querySelectorAll('td')[col];
    if (color === 0) {
        node.innerHTML = '';
    } else {
        let img = '';
        if (color === 1) {
            img = 'blue.png';
        } else if (color === 2) {
            img = 'red.png';
        }
        node.innerHTML = '<img width="300" height="300" src="' + img + '">';
    }
};

connection.gameStart = function () {
    turn = true;
    showMessage('Your turn!', 2000)
};

connection.gameEnd = function (winner) {
    showMessage(winner + ' won (next Game in 3 seconds)!', 3000)
};

connection.gameJoined = function () {
    showMessage('Game joined!')
};

// Initialize onClick
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        game[row].querySelectorAll('td')[col].onclick = () => {
            connection.choose(row, col);
        }
    }
}

