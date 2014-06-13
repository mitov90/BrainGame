// needs coordinates ot top left window and size of window (square as the other game)
function getShipGame(containerID, windowSize) {
    var stage = new Kinetic.Stage({
        container: containerID,
        width: windowSize,
        height: windowSize
    });

    var constants = {
        moveSpeed: 10,
        asteroidsCount: 10,
        asteroidSizeVary: 2,
        asteroidSizeConst: 20,
        addNewAsteroidTime1: 1500,
        addNewAsteroidTime2: 3300,
        moveAsteroidsTime: 20
    };

    var observerFunction = false;

    var layer = new Kinetic.Layer();

    // background setUp
    var backgroundImage = new Image();
    var backgroundKinetic = new Kinetic.Image({
        image: backgroundImage
    });
    layer.add(backgroundKinetic);
    
    // ship
    var shipImageSprites = new Image();
    shipImageSprites.src = 'images/ship-game/shipSprite.png';
    var ship = new Kinetic.Sprite({
        x: 20,
        y: 230,
        image: shipImageSprites,
        animation: 'fly',
        animations: {
            fly: [
                0, 0, 50, 45,
                53, 0, 50, 45,
                105, 0, 50, 45,
                53, 0, 50, 45
            ]
        },
        frameRate: 15,
        frameIndex: 0
    });
    layer.add(ship);
    ship.start();

    // player movement
    window.addEventListener("keydown", checkMove);
    function checkMove(e) {
        switch (e.keyCode) {
            case 38: // Up Arrow
            case 87: // W
                ship.setY(ship.getY() - constants.moveSpeed);
                if (ship.getY() < 0) {
                    ship.setY(0);
                }
                break;

            case 40: // Down Arrow
            case 83: // S
                ship.setY(ship.getY() + constants.moveSpeed);
                // vertical size of ship is 45 and field size is 460
                if (ship.getY() > 460 - 45) {
                    ship.setY(460 - 45);
                }
                break;

            case 37: // Left Arrow
            case 65: // A
                ship.setX(ship.getX() - constants.moveSpeed);
                if (ship.getX() < 0) {
                    ship.setX(0);
                }
                break;

            case 39: // RightArrow
            case 68: // D
                ship.setX(ship.getX() + constants.moveSpeed);
                // horizontal size of ship is 50 and field size is 460
                if (ship.getX() > 460 - 50) {
                    ship.setX(460 - 50);
                }
                break;
        }
        checkAsteroids();
        e.preventDefault();
    }

    // asteroids
    var asteroids = [];
    var asteroidImage = new Image();
    asteroidImage.src = 'images/ship-game/asteroid.png';
    var adder1 = setInterval(addNewAsteroid, constants.addNewAsteroidTime1);
    var adder2 = setInterval(addNewAsteroid, constants.addNewAsteroidTime2);

    var mover = setInterval(moveAsteroids, constants.moveAsteroidsTime);

    stage.add(layer);

    return {
        gameOver: gameOver,
        attachObserverFunction: attachObserverFunction
    };

    function attachObserverFunction(notifyFunction) {
        observerFunction = notifyFunction;
    }

    function moveAsteroids() {
        for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].setX(asteroids[i].getX() - 2);
            if (asteroids[i].getX() <= -100) {
                asteroids.shift();
            }
        }
        checkAsteroids();
    }

    function addNewAsteroid() {
        asteroids.push(getAsteroid(layer, asteroidImage, getRandom(constants.asteroidSizeVary * constants.asteroidSizeConst) + 2 * constants.asteroidSizeConst));

        function getAsteroid(currLayerToUse, imageToUse, sizeToUse) {
            var currAsteroid = new Kinetic.Image({
                image: imageToUse,
                width: sizeToUse,
                height: sizeToUse,
                x: 460 - sizeToUse,
                y: getRandom(460 - sizeToUse)
            });
            currLayerToUse.add(currAsteroid);

            return currAsteroid;
        }
    }

    function checkAsteroids() {
        for (var i = 0; i < asteroids.length; i++) {
            if (checkCollision(ship.getX() + 18,
                               ship.getY() + 16,
                               asteroids[i].attrs.x + asteroids[i].attrs.width / 2,
                               asteroids[i].attrs.y + asteroids[i].attrs.height / 2,
                               19, asteroids[i].attrs.width / 2)) {
                gameOver();
            }
        }

        function checkCollision(c1X, c1Y, c2X, c2Y, R1, R2) {
            return (c1X - c2X) * (c1X - c2X) + (c1Y - c2Y) * (c1Y - c2Y) <= (R1 + R2) * (R1 + R2);
        }
    }

    function getRandom(x) {
        return Math.floor(Math.random() * x);
    }

    function gameOver() {
        if (observerFunction) {
            observerFunction();
        }
        window.removeEventListener("keydown", checkMove);
        clearInterval(adder1);
        clearInterval(adder2);
        clearInterval(mover);
        explode();

        function explode() {
            var explosion = new Image();
            explosion.src = 'images/ship-game/explode.png';
            var boom = new Kinetic.Sprite({
                x: ship.getX() - 25,
                y: ship.getY() - 22,
                image: explosion,
                animation: 'explode',
                animations: {
                    explode: [
                        0, 0, 100, 100,
                        100, 0, 100, 100,
                        200, 0, 100, 100,
                        300, 0, 100, 100,
                        400, 0, 100, 100,
                        500, 0, 100, 100,
                        600, 0, 100, 100,
                        700, 0, 100, 100,
                        800, 0, 100, 100,
                        900, 0, 100, 100,
                        0, 100, 100, 100,
                        100, 100, 100, 100,
                        200, 100, 100, 100,
                        300, 100, 100, 100,
                        400, 100, 100, 100,
                        500, 100, 100, 100,
                        600, 100, 100, 100,
                        700, 100, 100, 100,
                        800, 100, 100, 100,
                        900, 100, 100, 100,
                        0, 200, 100, 100,
                        100, 200, 100, 100,
                        200, 200, 100, 100,
                        300, 200, 100, 100,
                        400, 200, 100, 100,
                        500, 200, 100, 100,
                        600, 200, 100, 100,
                        700, 200, 100, 100,
                        800, 200, 100, 100,
                        900, 200, 100, 100,
                        0, 300, 100, 100,
                        100, 300, 100, 100,
                        200, 300, 100, 100,
                        300, 300, 100, 100,
                        400, 300, 100, 100,
                        500, 300, 100, 100,
                        600, 300, 100, 100,
                        700, 300, 100, 100,
                        800, 300, 100, 100,
                        900, 300, 100, 100,
                        0, 400, 100, 100,
                        100, 400, 100, 100,
                        200, 400, 100, 100,
                        300, 400, 100, 100,
                        400, 400, 100, 100,
                        500, 400, 100, 100,
                        600, 400, 100, 100,
                        700, 400, 100, 100,
                        800, 400, 100, 100,
                        900, 400, 100, 100,
                        0, 500, 100, 100,
                        100, 500, 100, 100,
                        200, 500, 100, 100,
                        300, 500, 100, 100,
                        400, 500, 100, 100,
                        500, 500, 100, 100,
                        600, 500, 100, 100,
                        700, 500, 100, 100,
                        800, 500, 100, 100,
                        900, 500, 100, 100,
                        0, 600, 100, 100,
                        100, 600, 100, 100,
                        200, 600, 100, 100,
                        300, 600, 100, 100,
                        400, 600, 100, 100,
                        500, 600, 100, 100,
                        600, 600, 100, 100,
                        700, 600, 100, 100,
                        800, 600, 100, 100,
                        900, 600, 100, 100,
                        0, 700, 100, 100,
                        100, 700, 100, 100,
                        200, 700, 100, 100,
                        300, 700, 100, 100,
                        400, 700, 100, 100,
                        500, 700, 100, 100,
                        600, 700, 100, 100,
                        700, 700, 100, 100,
                        800, 700, 100, 100,
                        900, 700, 100, 100,
                        0, 800, 100, 100,
                        100, 800, 100, 100,
                        200, 800, 100, 100,
                        300, 800, 100, 100,
                        400, 800, 100, 100,
                        500, 800, 100, 100,
                        600, 800, 100, 100,
                        700, 800, 100, 100,
                        800, 800, 100, 100,
                        900, 800, 100, 100,
                        0, 900, 100, 100,
                        100, 900, 100, 100,
                        200, 900, 100, 100,
                        300, 900, 100, 100,
                        400, 900, 100, 100,
                        500, 900, 100, 100,
                        600, 900, 100, 100,
                        700, 900, 100, 100,
                        800, 900, 100, 100,
                        900, 900, 100, 100
                    ]
                },
                frameRate: 40,
                frameIndex: 0
            });
            layer.add(boom);
            boom.start();
            setTimeout(function () {
                boom.stop();
            }, 1000);
        }
    }

}