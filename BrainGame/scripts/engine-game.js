function runGame() {
    var score = 0;
    var fuel = 100;
    var scoreContainer = $('#score');
    var fuelContainer = $('#fuel');

    var shipGame = getShipGame('game-ship', 460);
    shipGame.attachObserverFunction(function () {
        // wait for explosion
        setTimeout(gameIsOver, 1000);
    });

    var numbersGame = getNumbersGame(525, 25, 460);
    numbersGame.attachRightAnswerObserverFunction(function () {
        fuel += 5;
        score += 10;
    });
    numbersGame.attachWrongAnswerObserverFunction(function () {
        fuel /= 2;
    })

    var gameEngine = setInterval(function () {
        score++;
        fuel--;
        scoreContainer.html(score);
        fuelContainer.html(fuel);
        if (fuel <= 0) {
            alert('Out of fuel');
            gameIsOver();
        }
    }, 1000)

    function gameIsOver() {
        // what to do when game over
        alert('sorry :(');
        clearInterval(gameEngine);
    }
}