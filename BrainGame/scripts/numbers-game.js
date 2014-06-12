// needs coordinates ot top left window and size of window (must be square by logic for coordinates object)
function getNumbersGame(windowX, windowY, windowSize) {
    // generates the main Raphael window
    var paperToDrawOn = Raphael(windowX, windowY, windowSize, windowSize);

    // game constants set the game difficulty
    var constants = {
        // node properties:
        nodeSize: 30, // serves also for node circle radius
        nodeMoveTrajectoryLengthMultyplyer: 2, // all nodes move a little - this is by how much relative to their size
        nodeMoveTrajectoryOverlapMultyplyer: 0, // all nodes will overlap a little - by this value * their size
        allNodesCount: 20,
        closeToAnswerNodesCount: 2, // nodes with the same answer as the real one but with different color
        colors: ['green', 'red', 'blue', 'yellow'],

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
        nodeTextfontFamily: 'Calibri',

        // event properties
        wrongAnswerClicked: 'wrong answer',
        rightAnswerClicked: 'right answer',
        equationClicked: 'equation'
    }

    // generates the initial allNodesObject which to be used troughout the game loop;
    // they own properties .equationNode ; .realAnswerNode ; .fakeAnswerNodes ([])
    // all the properties are left undefined
    // it is a Raphael set with circle and text inside
    // setting the set object x,y,cx,cy moves both objects together
    var allNodesObject = (function () {
        var equationNode = new NumberSetNode(paperToDrawOn);
        equationNode.set.click(function () {
            if (observerFunction) {
                observerFunction(constants.equationClicked);
            }
            RefreshAllNodesObject();
        });

        var realAnswerNode = new NumberSetNode(paperToDrawOn);
        realAnswerNode.set.click(function () {
            if (observerFunction) {
                observerFunction(constants.rightAnswerClicked);
            }
            RefreshAllNodesObject();
        });

        var fakeAnswerNodes = [];

        for (var i = 0; i < constants.allNodesCount; i++) {
            var currNodeToPush = new NumberSetNode(paperToDrawOn);
            currNodeToPush.set.click(function () {
                if (observerFunction) {
                    observerFunction(constants.wrongAnswerClicked);
                }
                RefreshAllNodesObject();
            })
            fakeAnswerNodes.push(currNodeToPush);
        }

        // attach individual animation events here
        // equationNode.set.animate(...)
        // all nodes are Raphael set objects

        // this is a sample animation for the equation node
        var anim = Raphael.animation({ "transform": "r 360" }, 3000, "bounce");
        equationNode.set.animate(anim.repeat(1000)); // run the given animation after 500 ms

        return {
            equationNode: equationNode,
            realAnswerNode: realAnswerNode,
            fakeAnswerNodes: fakeAnswerNodes,
        }

        // creates a new Raphael Set node with circle and text appended
        // sets initial settings and coordinates 0 0
        function NumberSetNode(paper) {
            paper.setStart();
            paper.circle(0, 0, constants.nodeSize);
            paper.text(0, 0, '')
                .attr({
                    'text-anchor': 'center',
                    stroke: constants.nodeTextStroke,
                    'stroke-width': constants.nodeTextStrokeWidth,
                    'font-size': constants.nodeTextFontSize,
                    'font-family': constants.nodeTextfontFamily
                })
            this.set = paper.setFinish();
            // animating all node objects here
            // this.set.animate(...);
        }
    }());

    // all coordinates object
    var allCoordinatesObject = (function () {
        var allCoords = [];

        // all the nodes are set in the constant. Only 2 are left - the real answer node and the equation node
        // if a node has a size of 40 and the multiplyer is 2 the node will move in a trajectory of 80px
        var neededSizeForASingleNode = Math.floor(
                                          (constants.nodeSize * constants.nodeMoveTrajectoryLengthMultyplyer)
                                        - (constants.nodeSize * constants.nodeMoveTrajectoryOverlapMultyplyer));

        var numberOfNodesPerLine = Math.floor(windowSize / neededSizeForASingleNode);

        var leftSpaceUnused = windowSize - (neededSizeForASingleNode * numberOfNodesPerLine);
        var additionOfSizeForASingleNode = Math.floor((leftSpaceUnused / numberOfNodesPerLine));

        neededSizeForASingleNode += additionOfSizeForASingleNode;

        var centerX;
        var centerY;

        for (var rowX = 0; rowX < numberOfNodesPerLine; rowX++) {
            for (var colY = 0; colY < numberOfNodesPerLine; colY++) {
                centerX = Math.floor((rowX * neededSizeForASingleNode) + neededSizeForASingleNode / 2);
                centerY = Math.floor((colY * neededSizeForASingleNode) + neededSizeForASingleNode / 2);
                allCoords.push({
                    x: centerX,
                    y: centerY,
                })
            }
        }

        return allCoords;
    }());

    var observerFunction;

    RefreshAllNodesObject();

    return {
        constants: constants,
        getNewLevel:RefreshAllNodesObject,
        attachObserverFunction: attachObserverFunction,
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
                fill: currentEqColor,
            });
        }());

        // generate real answer node
        (function () {
            allNodesObjectToAlter.realAnswerNode.set.attr({
                text: currentEquation.answer,
                fill: currentEqColor,
            });
        }());

        // generate close to answer nodes with text == answer and color != answer
        (function () {
            for (i = 0; i < constants.closeToAnswerNodesCount; i++) {
                colorToUse = constants.colors[getRandom(constants.colors.length)];

                // if the generated color is the same as the real answer - create again
                while (colorToUse == currentEqColor) {
                    colorToUse = constants.colors[getRandom(constants.colors.length)];
                }

                allNodesObjectToAlter.fakeAnswerNodes[i].set.attr({
                    text: currentEquation.answer,
                    fill: colorToUse,
                });
            }
        }());

        // randomly generate nodes with text != equation answer
        (function () {
            for (i = constants.closeToAnswerNodesCount; i < allNodesObjectToAlter.fakeAnswerNodes.length; i++) {
                answerToUse = getRandom(constants.maxNumberAddSubstract);

                while (answerToUse == currentEquation.answer) {
                    answerToUse = getRandom(constants.maxNumberAddSubstract);
                }
                allNodesObjectToAlter.fakeAnswerNodes[i].set.attr({
                    text: answerToUse,
                    fill: constants.colors[getRandom(constants.colors.length)],
                });
            }
        }());

        // returns a new Equation object with properties .text ("1+1") and .answer (2)
        function generateRandomEquation() {
            var operations = [add, substract, multiply, divide];

            var currentOperation = operations[getRandom(constants.operations)];
            var operand1;
            var operand2;

            if (currentOperation == add) {
                operand1 = getRandom(constants.maxNumberAddSubstract);
                operand2 = getRandom(constants.maxNumberAddSubstract);

                return new Equation(operand1 + "+" + operand2, operand1 + operand2);
            }
            else if (currentOperation == substract) {
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
                    operator: '+',
                }
            }

            function substract(a, b) {
                return {
                    answer: a - b,
                    operator: '-',
                }
            }

            function multiply(a, b) {
                return {
                    answer: a * b,
                    operator: '*',
                }
            }

            function divide(a, b) {
                return {
                    answer: a / b,
                    operator: '/',
                }
            }
        }
    }

    // takes a allNodesObj and changes its Answer node elements properties (x,y)
    // works with .equationNode ; .realAnswerNode ; .fakeAnswerNodes ([])
    function changeAllNodesCoordinates(allNodesObjectToAlter, allCoordinatesObjectToUse) {
        shuffleCoordinates(allCoordinatesObjectToUse);
        var index = 0;

        // changing all the fake nodes
        for (var index = 0; index < allNodesObjectToAlter.fakeAnswerNodes.length; index++) {
            allNodesObjectToAlter.fakeAnswerNodes[index].set.attr({
                x: allCoordinatesObjectToUse[index].x,
                cx: allCoordinatesObjectToUse[index].x,
                y: allCoordinatesObjectToUse[index].y,
                cy: allCoordinatesObjectToUse[index].y,
            });
        };

        // changing the equationNode

        // the index is already incremented by the for cycle above
        allNodesObjectToAlter.equationNode.set.attr({
            x: allCoordinatesObjectToUse[index].x,
            cx: allCoordinatesObjectToUse[index].x,
            y: allCoordinatesObjectToUse[index].y,
            cy: allCoordinatesObjectToUse[index].y,
        });


        // changing the real answerNode

        // the index is the same as with equationNode coordinates
        index++;

        allNodesObjectToAlter.realAnswerNode.set.attr({
            x: allCoordinatesObjectToUse[index].x,
            cx: allCoordinatesObjectToUse[index].x,
            y: allCoordinatesObjectToUse[index].y,
            cy: allCoordinatesObjectToUse[index].y,
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
            };
        }
    }

    function RefreshAllNodesObject() {
        changeAllNodesContent(allNodesObject);
        changeAllNodesCoordinates(allNodesObject, allCoordinatesObject);
    }

    // returns a random int number from 0 to x NOT including x
    function getRandom(x) {
        return Math.floor(Math.random() * x);
    }

    function attachObserverFunction(notifyFunction) {
        observerFunction = notifyFunction;
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

