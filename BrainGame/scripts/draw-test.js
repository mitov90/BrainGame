window.onload = function () {

    var paper = Raphael('game-number', constants.gameWindowWidth, constants.gameWindowHeight);
    var nodes = generateNumberNodes();

    var equationNode = nodes.equationNode;
    equationNode.x = Math.random() * (constants.gameWindowWidth-400) + 200;
    equationNode.y = constants.gameWindowHeight - constants.rectNodeHeight * 3 / 2;
    drawNode(paper,equationNode);

    var answerNode = nodes.realAnswerNode;
    answerNode.x = Math.random() * (constants.gameWindowWidth - 100) + 50;
    answerNode.y = Math.random() * (constants.gameWindowHeight - 100) + 50;
    drawNode(paper, answerNode);

    for (var i = nodes.fakeAnswerNodes.length - 1; i >= 0; i--) {
        var node = nodes.fakeAnswerNodes[i];
        node.x = Math.random() * (constants.gameWindowWidth - 100) + 50;
        node.y = Math.random() * (constants.gameWindowHeight - 100) + 50;
        drawNode(paper, node);
    }

}