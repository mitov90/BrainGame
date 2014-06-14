Raphael.fn.ball = function (x, y, r, hue) {
    hue = hue || 0;
    return this.set(
        this.ellipse(x, y + r - r / 5, r, r / 2).attr({ fill: "rhsb(" + hue + ", 1, .25)-hsb(" + hue + ", 1, .25)", stroke: "none", opacity: 0 }),
        this.ellipse(x, y, r, r).attr({ fill: "r(.5,.9)hsb(" + hue + ", 1, 0.9)-hsb(" + hue + ", .8, .3)", stroke: "none" }),
        this.ellipse(x, y, r - r / 5, r - r / 20).attr({ stroke: "none", fill: "r(.5,.1)#ccc-#ccc", opacity: 0 })
    );
};


// needs coordinates ot top left window and size of window (must be square by logic for coordinates object)
function getNumbersGame(holderID) {
    var holder = document.getElementById(holderID);
    var windowSize = holder.offsetWidth;

    // generates the main Raphael window
    var paperToDrawOn = Raphael(holderID, windowSize, windowSize);

    // game constants set the game difficulty
    var constants = {
        // node properties:
        nodeSize: 30, // serves also for node circle radius
        nodeMoveTrajectoryLengthMultyplyer: 2, // all nodes move a little - this is by how much relative to their size
        nodeMoveTrajectoryOverlapMultyplyer: 0, // all nodes will overlap a little - by this value * their size
        allNodesCount: 20,
        closeToAnswerNodesCount: 2, // nodes with the same answer as the real one but with different color
        colors: ['#FFAEAE', '#56BAEC', '#B0E57C', '#FFEC94'],

        // equation generator constants
        operations: 4, // + - * / - reduce this to operate with fiew operators
        maxNumberAddSubstract: 50,
        maxNumberMultyply: 10,
        maxNumberToDivide: 100,
        maxNumberToDivideOn: 6, // always adding 2 (from 2 to this value)

        // drawing properties
        nodeTextStroke: '#000',
        nodeTextStrokeWidth: 2,
        nodeTextFontSize: '22px',
        nodeTextfontFamily: 'Calibri'
    };

    // generates the initial allNodesObject which to be used troughout the game loop;
    // they own properties .equationNode ; .realAnswerNode ; .fakeAnswerNodes ([])
    // all the properties are left undefined
    // it is a Raphael set with circle and text inside
    // setting the set object x,y,cx,cy moves both objects together
    var allNodesObject = (function () {
        var equationNode = new NumberSetNode(paperToDrawOn);
        equationNode.set.click(function () {
            RefreshAllNodesObject();
        });

        var realAnswerNode = new NumberSetNode(paperToDrawOn);
        realAnswerNode.set.click(onCorrectAnswerGiven);

        var fakeAnswerNodes = [];

        for (var i = 0; i < constants.allNodesCount; i++) {
            var currNodeToPush = new NumberSetNode(paperToDrawOn);
            currNodeToPush.set.click(onWrongAnswerGiven);
            fakeAnswerNodes.push(currNodeToPush);
        }

        //animation func for hover effect
        function animateHover() {
            this.g = this.glow({color: "#FFF", width: 100});
        }

        function removeHover(){
            //this.g.remove();
        }

        // attach individual animation events here
        // equationNode.set.animate(...)
        // all nodes are Raphael set objects

        // this is a sample animation for the equation node
        var animationTime = 3000;
        var anim = Raphael.animation({ "transform": "r 360" }, animationTime, "bounce");
        var t = equationNode.set.animate(anim.repeat(1000)); // run the given animation after 500 ms
        setTimeout(function(){t.stop()},animationTime);

        return {
            equationNode: equationNode,
            realAnswerNode: realAnswerNode,
            fakeAnswerNodes: fakeAnswerNodes
        };

        function onCorrectAnswerGiven() {

            if (rightAnswerObserverFunction) {
                rightAnswerObserverFunction();
            }

            RefreshAllNodesObject();
        }

        function onWrongAnswerGiven() {

            if (wrongAnswerObserverFunction) {
                wrongAnswerObserverFunction();
            }

            RefreshAllNodesObject();
        }

        // creates a new Raphael Set node with circle and text appended
        // sets initial settings and coordinates 0 0

        

        function NumberSetNode(paper) {
            paper.setStart();
            //paper.circle(0, 0, constants.nodeSize);
            paper.ball(0, 0, constants.nodeSize, Math.random()); // TODO: fix random colors
            paper.text(0, 0, '')
                .attr({
                    'text-anchor': 'center',
                    stroke: constants.nodeTextStroke,
                    'stroke-width': constants.nodeTextStrokeWidth,
                    'font-size': constants.nodeTextFontSize,
                    'font-family': constants.nodeTextfontFamily
                });

            this.set = paper.setFinish();

            


            // animating all node objects here
            // this.set.animate(...);
        }
    }());

    // all coordinates object
    // needs windowSize
    var allCoordinatesObject = (function () {
        var allCoords = [];

        // all the nodes are set in the constant. Only 2 are left - the real answer node and the equation node
        // if a node has a size of 40 and the multiplyer is 2 the node will move in a trajectory of 80px
        var neededSizeForASingleNode = Math.floor(
                                          (constants.nodeSize * constants.nodeMoveTrajectoryLengthMultyplyer) -
                (constants.nodeSize * constants.nodeMoveTrajectoryOverlapMultyplyer));

        var numberOfNodesPerLine = Math.floor(windowSize / neededSizeForASingleNode);

        var centerX;
        var centerY;

        for (var rowX = 0; rowX < numberOfNodesPerLine; rowX++) {
            for (var colY = 0; colY < numberOfNodesPerLine; colY++) {
                centerX = Math.floor((rowX * neededSizeForASingleNode) + neededSizeForASingleNode / 2);
                centerY = Math.floor((colY * neededSizeForASingleNode) + neededSizeForASingleNode / 2);
                allCoords.push({
                    x: centerX,
                    y: centerY
                });
            }
        }

        return allCoords;
    }());

    var rightAnswerObserverFunction;
    var wrongAnswerObserverFunction;

    RefreshAllNodesObject();

    return {
        constants: constants,
        getNewLevel:RefreshAllNodesObject,
        attachRightAnswerObserverFunction: attachRightAnswerObserverFunction,
        attachWrongAnswerObserverFunction: attachWrongAnswerObserverFunction
    };

    // the function is called on right answer clicked
    function attachRightAnswerObserverFunction(notifyFunction) {
        rightAnswerObserverFunction = notifyFunction;
    }

    // the function is called on right wrong clicked
    function attachWrongAnswerObserverFunction(notifyFunction) {
        wrongAnswerObserverFunction = notifyFunction;
    }

    // takes a allNodesObj and changes its Answer node elements properties (text and color)
    // works with .equationNode ; .realAnswerNode ; .fakeAnswerNodes ([])
    function changeAllNodesContent(allNodesObjectToAlter) {
        // generate the next equation to use
        var currentEquation = generateRandomEquation();
        var currentEqColor = constants.colors[getRandom(constants.colors.length)];

        var i;
        var answerToUse;
        var colorToUse;

        // generate equation node
        (function () {
            allNodesObjectToAlter.equationNode.set.attr({
                text: currentEquation.text,
                //fill: currentEqColor
            });
        }());

        // generate real answer node
        (function () {
            allNodesObjectToAlter.realAnswerNode.set.attr({
                text: currentEquation.answer,
                //fill: currentEqColor
            });
        }());

        // generate close to answer nodes with text == answer and color != answer
        (function () {
            for (i = 0; i < constants.closeToAnswerNodesCount; i++) {
                colorToUse = constants.colors[getRandom(constants.colors.length)];

                // if the generated color is the same as the real answer - create again
                while (colorToUse === currentEqColor) {
                    colorToUse = constants.colors[getRandom(constants.colors.length)];
                }

                allNodesObjectToAlter.fakeAnswerNodes[i].set.attr({
                    text: currentEquation.answer,
                    //fill: colorToUse
                });
            }
        }());

        // randomly generate nodes with text != equation answer
        (function () {
            for (i = constants.closeToAnswerNodesCount; i < allNodesObjectToAlter.fakeAnswerNodes.length; i++) {
                answerToUse = getRandom(constants.maxNumberAddSubstract);

                while (answerToUse === currentEquation.answer) {
                    answerToUse = getRandom(constants.maxNumberAddSubstract);
                }
                allNodesObjectToAlter.fakeAnswerNodes[i].set.attr({
                    text: answerToUse,
                    //fill: constants.colors[getRandom(constants.colors.length)]
                });
            }
        }());

        // returns a new Equation object with properties .text ("1+1") and .answer (2)
        function generateRandomEquation() {
            var operations = [add, substract, multiply, divide];

            var currentOperation = operations[getRandom(constants.operations)];
            var operand1;
            var operand2;

            if (currentOperation === add) {
                operand1 = getRandom(constants.maxNumberAddSubstract);
                operand2 = getRandom(constants.maxNumberAddSubstract);

                return new Equation(operand1 + "+" + operand2, operand1 + operand2);
            }
            else if (currentOperation === substract) {
                operand1 = getRandom(constants.maxNumberAddSubstract);
                operand2 = getRandom(constants.maxNumberAddSubstract);

                // ensures that the answer is always positive
                while (operand1 < operand2) {
                    operand1 = getRandom(constants.maxNumberAddSubstract);
                    operand2 = getRandom(constants.maxNumberAddSubstract);
                }

                return new Equation(operand1 + "-" + operand2, operand1 - operand2);
            }
            else if (currentOperation == multiply) {
                operand1 = getRandom(constants.maxNumberMultyply);
                operand2 = getRandom(constants.maxNumberMultyply);

                return new Equation(operand1 + "*" + operand2, operand1 * operand2);
            }
            else if (currentOperation == divide) {
                operand1 = getRandom(constants.maxNumberToDivide);
                operand2 = getRandom(constants.maxNumberToDivideOn) + 2;

                // guaranties that the division will produce a whole number
                while (Math.floor(operand1 / operand2) != operand1 / operand2) {
                    operand1 = getRandom(constants.maxNumberToDivide);
                    operand2 = getRandom(constants.maxNumberToDivideOn) + 2;
                }

                return new Equation(operand1 + "/" + operand2, operand1 / operand2);
            }

            // equation object
            function Equation(text, answer) {
                this.text = text;
                this.answer = answer;
            }

            function add(a, b) {
                return {
                    answer: a + b,
                    operator: '+'
                };
            }

            function substract(a, b) {
                return {
                    answer: a - b,
                    operator: '-'
                };
            }

            function multiply(a, b) {
                return {
                    answer: a * b,
                    operator: '*'
                };
            }

            function divide(a, b) {
                return {
                    answer: a / b,
                    operator: '/'
                };
            }
        }
    }

    // takes a allNodesObj and changes its Answer node elements properties (x,y)
    // works with .equationNode ; .realAnswerNode ; .fakeAnswerNodes ([])
    function changeAllNodesCoordinates(allNodesObjectToAlter, allCoordinatesObjectToUse) {
        shuffleCoordinates(allCoordinatesObjectToUse);

        // changing all the fake nodes
        for (var index = 0; index < allNodesObjectToAlter.fakeAnswerNodes.length; index++) {
            allNodesObjectToAlter.fakeAnswerNodes[index].set.attr({
                x: allCoordinatesObjectToUse[index].x,
                cx: allCoordinatesObjectToUse[index].x,
                y: allCoordinatesObjectToUse[index].y,
                cy: allCoordinatesObjectToUse[index].y
            });
        }

        // changing the equationNode

        // the index is already incremented by the for cycle above
        allNodesObjectToAlter.equationNode.set.attr({
            x: allCoordinatesObjectToUse[index].x,
            cx: allCoordinatesObjectToUse[index].x,
            y: allCoordinatesObjectToUse[index].y,
            cy: allCoordinatesObjectToUse[index].y
        });


        // changing the real answerNode

        // the index is the same as with equationNode coordinates
        index++;

        allNodesObjectToAlter.realAnswerNode.set.attr({
            x: allCoordinatesObjectToUse[index].x,
            cx: allCoordinatesObjectToUse[index].x,
            y: allCoordinatesObjectToUse[index].y,
            cy: allCoordinatesObjectToUse[index].y
        });

        // Fisher-Yates shuffle implementation
        // http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        function shuffleCoordinates(arrayToShuffle) {
            var j;
            var temp;

            for (var i = 0; i < arrayToShuffle.length; i++) {
                // random function returns NOT including to
                j = getRandom(i + 1);
                temp = arrayToShuffle[i];
                arrayToShuffle[i] = arrayToShuffle[j];
                arrayToShuffle[j] = temp;
            }
        }
    }

    function RefreshAllNodesObject() {
        changeAllNodesContent(allNodesObject);
        changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);

        // TODO: raphael objects
        //allNodesObject.equationNode.set.animate({
        //    fill: 'red',
        //    'fill-opacity': '1',
        //    callback: function () {
        //        allNodesObject.equationNode.set.animate({
        //            fill: 'white',
        //            'fill-opacity': '0'
        //        }, 500)
        //    }
        //}, 500);
        //allNodesObject.realAnswerNode.set
        //allNodesObject.fakeAnswerNodes.set
    }

    // returns a random int number from 0 to x NOT including x
    function getRandom(x) {
        return Math.floor(Math.random() * x);
    }

    // holds all tests for development
    // uncomment the function calls in it to initiate
    // comment all this code in the release version
     //(function testFunctionsHolder() {
     //    // test function
     //    function testGeneratedCoordinatesObject() {
     //        console.log(allCoordinatesObject);
     //    }
     //    // testGeneratedCoordinatesObject();

     //    // test function
     //    function testGeneratedAllNodesObject() {
     //        console.log(allNodesObject);
     //    }
     //    // testGeneratedAllNodesObject();

     //    // test function
     //    function testChangeAllNodesFunction() {
     //         changeAllNodesContent(allNodesObject);
     //         console.log("Question is:");
     //         console.log(allNodesObject.equationNode);
     //         console.log("Answer is:");
     //         console.log(allNodesObject.realAnswerNode);
     //         console.log("Close answers are:");
     //         console.log(allNodesObject.fakeAnswerNodes[0]);
     //         console.log(allNodesObject.fakeAnswerNodes[1]);
     //         console.log("Far answers are:");
     //         console.log(allNodesObject.fakeAnswerNodes[7]);
     //         console.log(allNodesObject.fakeAnswerNodes[13]);
     //         console.log(allNodesObject.fakeAnswerNodes[21]);

     //         window.onclick = testChangeAllNodesFunction;
     //    }
     //    // click to test
     //    // testChangeAllNodesFunction();

     //    // test function
     //    // click to test
     //    function testShuffleCoordinatesObjectAndClickToChange () {
     //        changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);
     //        console.log(allCoordinatesObject);
     //        window.onclick = testShuffleCoordinatesObjectAndClickToChange;
     //    }
     //    // testShuffleCoordinatesObjectAndClickToChange();

     //    // test function
     //    // click to test
     //    function testAllNodesObjectNewCoordinatesAssigment () {
     //        changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);
     //        console.log(allNodesObject);
     //        window.onclick = testAllNodesObjectNewCoordinatesAssigment;
     //    }
     //    // testAllNodesObjectNewCoordinatesAssigment();

     //    // test function
     //    // click to test
     //    function testDrawRandomSetOfElementsAndChangeThemOnClick () {
     //        changeAllNodesContent(allNodesObject);
     //        changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);
     //        function change(){
     //            changeAllNodesContent(allNodesObject);
     //            changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);
     //        }
     //        window.onclick = change;
     //        console.log(allNodesObject)
     //    }
     //    // testDrawRandomSetOfElementsAndChangeThemOnClick();
     //}());
}

