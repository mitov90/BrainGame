function generateNumberNodes() {
    // game constants set the game dificulty
    var constants = {
        operations: 4, // + - * / - reduce this to operate with fiew operators
        maxNumberAddSubstract: 50,
        maxNumberMultyply: 10,
        maxNumberToDivide: 100,
        maxNumberToDivideOn: 6, // always adding 2 (from 2 to this value)
        allNodesCount: 25,
        closeToAnswerNodesCount: 3, // nodes with the same answer as the real one but with different shape or color
        shapes: ['rect', 'circle'],
        colors: ['green', 'red', 'blue'],
    }

    function generateAllNodes() {
        var fakeAnswerNodes = [];
        var realAnswerNode;
        var equationNode;

        var currentEquation = generateRandomEquation();
        var currentEqColor = constants.colors[getRandom(constants.colors.length)];
        var currentEqShape = constants.shapes[getRandom(constants.shapes.length)];

        // generate equation node
        (function () {
            equationNode = new AnswerNode(0, 0, currentEquation.text, currentEqColor, currentEqShape);
        }());

        // generate real answer node
        (function () {
            realAnswerNode = new AnswerNode(0, 0, currentEquation.answer, currentEqColor, currentEqShape);
        }());

        // generate close to answer nodes with text == answer and shape and color != answer
        (function () {
            for (var i = 0; i < constants.closeToAnswerNodesCount; i++) {
                var colorToUse = constants.colors[getRandom(constants.colors.length)];
                var shapeToUse = constants.shapes[getRandom(constants.shapes.length)];

                // if the generated shape and color are completely different or absolutely the same as the real answer - create again
                while ((colorToUse == currentEqColor && shapeToUse == currentEqShape)
                    || (colorToUse != currentEqColor && shapeToUse != currentEqShape)) {
                    colorToUse = constants.colors[getRandom(constants.colors.length)];
                    shapeToUse = constants.shapes[getRandom(constants.shapes.length)];
                }

                fakeAnswerNodes.push(new AnswerNode(0, 0, currentEquation.answer, colorToUse, shapeToUse));
            }
        }());

        // randomly generate nodes with text != equation answer
        (function () {
            for (var i = 0; i < constants.allNodesCount - constants.closeToAnswerNodesCount; i++) {
                var currAnswer = getRandom(constants.maxNumberAddSubstract);

                while (currAnswer == currentEquation.answer) {
                    currAnswer = getRandom(constants.maxNumberAddSubstract);
                }

                fakeAnswerNodes.push(new AnswerNode(
                                    0,
                                    0,
                                    currAnswer,
                                    constants.colors[getRandom(constants.colors.length)],
                                    constants.shapes[getRandom(constants.shapes.length)]));
            }
        }());

        return {
            fakeAnswerNodes: fakeAnswerNodes,
            realAnswerNode: realAnswerNode,
            equationNode: equationNode,
        }

        // returns a new Answer node - setting the x and y is NOT done here
        function AnswerNode(x, y, text, color, shape) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.color = color;
            this.shape = shape;
        }

        // returns a new Equation object with properties .text ("1+1") and .answer (2)
        function generateRandomEquation() {
            var operations = [add, substract, multiply, divide];

            var currentOperation = operations[getRandom(constants.operations)];
            var operand1;
            var operand2;

            if (currentOperation == add) {
                operand1 = getRandom(constants.maxNumberAddSubstract);
                operand2 = getRandom(constants.maxNumberAddSubstract);

                return new Equation(operand1 + " + " + operand2, operand1 + operand2);
            }
            else if (currentOperation == substract) {
                operand1 = getRandom(constants.maxNumberAddSubstract);
                operand2 = getRandom(constants.maxNumberAddSubstract);

                // ensures that the answer is always positive
                while (operand1 < operand2) {
                    operand1 = getRandom(constants.maxNumberAddSubstract);
                    operand2 = getRandom(constants.maxNumberAddSubstract);
                }

                return new Equation(operand1 + " - " + operand2, operand1 - operand2);
            }
            else if (currentOperation == multiply) {
                operand1 = getRandom(constants.maxNumberMultyply);
                operand2 = getRandom(constants.maxNumberMultyply);

                return new Equation(operand1 + " * " + operand2, operand1 * operand2);
            }
            else if (currentOperation == divide) {
                operand1 = getRandom(constants.maxNumberToDivide);
                operand2 = getRandom(constants.maxNumberToDivideOn) + 2;

                // guaranties that the division will produce a whole number
                while (Math.floor(operand1 / operand2) != operand1 / operand2) {
                    operand1 = getRandom(constants.maxNumberToDivide);
                    operand2 = getRandom(constants.maxNumberToDivideOn) + 2;
                }

                return new Equation(operand1 + " / " + operand2, operand1 / operand2);
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

        // helping functions
        function getRandom(x) {
            return Math.floor(Math.random() * x);
        }
    }

    // test returned objects
    // console.log(generateAllNodes());

    return generateAllNodes();
}