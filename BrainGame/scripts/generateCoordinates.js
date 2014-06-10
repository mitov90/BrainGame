(function (){
    //initial coordinates
    var direction = "none",
                    plankX = 20,
                    plankY = 100,
                    plankWidth = 100,
                    plankHeight = 5,
                    ballX = (2 * plankX + plankWidth) / 2,
                    ballY = 95,
                    ballRadius = 5,
                    distanceBetweenCenterAndBall = (ballRadius + 0.1);

    function generateCoordinates(direction) {
        if (direction === "right") {
            var currentBallX = 0,
                currentBallY = 0,
                plankCenterX = (2 * plankX + plankWidth) / 2,
                angleBetweenPlankAndBall = Math.tan(ballRadius / distanceBetweenCenterAndBall); //angle in radians
            //move ball
            distanceBetweenCenterAndBall += 0.5;
            currentBallX = plankCenterX + distanceBetweenCenterAndBall * Math.cos(angleBetweenPlankAndBall);
            currentBallY = plankY + distanceBetweenCenterAndBall * Math.sin(-angleBetweenPlankAndBall);
            ballX = currentBallX;
            ballY = currentBallY;
            //move plank

        }

        if (direction === "left") {
            var currentBallX = 0,
                currentBallY = 0,
                plankCenterX = (2 * plankX + plankWidth) / 2,
                angleBetweenPlankAndBall = Math.tan(ballRadius / distanceBetweenCenterAndBall); //angle in radians
            //move ball 
            distanceBetweenCenterAndBall -= 0.5;
            currentBallX = plankCenterX + distanceBetweenCenterAndBall * Math.cos(angleBetweenPlankAndBall);
            currentBallY = plankY + distanceBetweenCenterAndBall * Math.sin(-angleBetweenPlankAndBall);
            ballX = currentBallX;
            ballY = currentBallY;
            //move plank with ball radius
        }

        return {
            ballX: ballX,
            ballY: ballY,
            ballRadius: ballRadius,
            plankX: plankX,
            plankY: plankY,
            plankWidth: plankWidth,
            plankHeight: plankHeight
        }
    }
    function move(direction) {
        var objCoords;
        if (direction === "left") {
            objCoords = generateCoordinates("left");
        }
        if (direction === "right") {
            objCoords = generateCoordinates("right");
        }
        return objCoords;
    };

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 37) {
            direction = "left";
            // move("left");
        }
        else if (e.keyCode === 39) {
            direction = "right";
            // move("right");
        }

    });

    // some test with Kineticjs objects
    //var layer = new Kinetic.Layer(),
    //			stage = new Kinetic.Stage({
    //			    container: 'game-balance',
    //			    x: 10,
    //			    y: 10,
    //			    width: 460,
    //			    height: 250
    //			}),
    //circle = new Kinetic.Circle({
    //    x: ballX,
    //    y: ballY,
    //    radius: ballRadius,
    //    stroke: 'black'
    //}),
    //    rect = new Kinetic.Rect({
    //        x: plankX,
    //        y: plankY,
    //        width: plankWidth,
    //        height: plankHeight,
    //        stroke: 'black'
    //    });

    //layer.add(circle);
    //layer.add(rect);

    //var animation = new Kinetic.Animation(function () {
    //    var testObj = generateCoordinates(direction);

    //    circle.setX(testObj.ballX);
    //    circle.setY(testObj.ballY);
    //    circle.setRadius(testObj.ballRadius);
    //    rect.setX(testObj.plankX);
    //    rect.setY(testObj.plankY);
    //    rect.setWidth(testObj.plankWidth);
    //    rect.setHeight(testObj.plankHeight);
    //}, layer);
    //animation.start();
    //stage.add(layer);
}());