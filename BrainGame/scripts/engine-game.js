function createGame(holderQuerrySelector) {
    var $holder = $(holderQuerrySelector);

    var $shipGame = $('<div />')
                        .attr('id', 'game-ship')
                        .appendTo($holder);

    var $numbersGame = $('<div />')
                        .attr('id', 'game-numbers')
                        .appendTo($holder);

    var $graphGame = $('<div />')
                        .attr('id', 'game-graph')
                        .appendTo($holder);

    var score = 0;
    var fuel = 100;

    var shipGame = getShipGame($shipGame.attr('id'));
    shipGame.attachObserverFunction(endGame);

    var numbersGame = getNumbersGame($numbersGame.attr('id'));
    numbersGame.attachRightAnswerObserverFunction(numbersRightAnswer);
    numbersGame.attachWrongAnswerObserverFunction(numbersWrongAnswer);

    var graph = createGraph($graphGame.attr('id'));

    var gameEngine = setInterval(gameRefresh, 100);

    function gameRefresh() {
        score++;
        fuel -= 0.1;

        if (fuel <= 0) {
            endGame();
        }

        // graph Y is on 0 to 120 -> on 100 fuel - 20 Y
        // less fuel means more Y
        graph.drawPoint(120 - fuel);

        graph.setScore(score);
        graph.setFuel(fuel);
    }

    function numbersRightAnswer() {
        fuel += 5;
        score += 10;
        graph.addAnswered();
    }

    function numbersWrongAnswer() {
        fuel -= 10;
    }

    function endGame() {
        // what to do when game over
        clearInterval(gameEngine);
        setTimeout(function () {
            $holder.fadeOut(3000);
        },500)
    }
}