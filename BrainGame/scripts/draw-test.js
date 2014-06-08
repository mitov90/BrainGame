window.onload = function () {
    var paper = Raphael('game-number', constants.gameWindowWidth, constants.gameWindowHeigth);
    var nodes = generateNumberNodes();

    //debug
    var someNodeforTest = nodes.equationNode;
    someNodeforTest.x = 50;
    someNodeforTest.y = 50;
    drawNode(someNodeforTest);
    //end debug

    function drawNode(node) {
        switch (node.shape) {
        case 'rect':
        {
            drawRect(node);
            break;
        }

        case 'circle':
        {
            drawCircle(node);
            break;
        }
        }
    }

    function drawCircle(node) {
        paper.circle(node.x, node.y, constants.circleNodeRadius)
                .attr({
                    fill: node.color,
                    stroke: 'none'
                })
                .click(function (event) {
                    //TODO: Add event listener to figure
                });
        paper.text(node.x, node.y, node.text)
            .attr({
                stroke: 'black'
            })
            .click(function (event) {
                //TODO: Add event listener to figure
            });
    }

    function drawRect(node) {
        paper.rect(node.x, node.y, constants.rectNodeWidth, constants.rectNodeHeigth).
            //adding attributes
            attr({
                fill: node.color,
                stroke: 'none'
            })
            //adding event
            .click(function(event) {
                //TODO: Add event listener to figure
            });
        //adding text inside shape
        paper.text(node.x + constants.rectNodeWidth / 2, node.y + constants.rectNodeHeigth / 2, node.text)
            .attr({
                stroke: 'black'
            })
            .click(function(event) {
                //TODO: Add event listener to figure
            });
    }

}