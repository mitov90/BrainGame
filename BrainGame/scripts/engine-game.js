function runGame() {
    var shipGame = getShipGame('game-ship', 460);
    shipGame.attachObserverFunction(function () {
        // wait for explosion
        setTimeout(gameIsOver, 1000);
    });

    var numbersGame = getNumbersGame(525, 25, 460);
    numbersGame.attachObserverFunction(function (text) {
        console.log(text);
    });

    function gameIsOver() {
        // what to do when game over
        alert('bye');
    }
}