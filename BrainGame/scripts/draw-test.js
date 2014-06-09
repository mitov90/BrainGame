window.onload = function() {
    var paper = Raphael('game-number', constants.gameWindowWidth, constants.gameWindowHeight);
    var nodes = generateNumberNodes();

    //debug
    var someNodeforTest = nodes.equationNode;
    someNodeforTest.x = Math.random()* (constants.gameWindowWidth-100) + 30;
    someNodeforTest.y = Math.random() * (constants.gameWindowHeight-100) +30 ;
    drawNode(someNodeforTest);
    //end debug

    function drawNode(node) {
        if (node.shape === 'rect') {
            drawRect(node);
        } else if (node.shape === 'circle') {
            drawCircle(node);
        }
    }

    function drawCircle(node) {
        var circle = paper.circle(node.x, node.y, constants.circleNodeRadius);
        setShapeAttributes(circle, node);

        var text = paper.text(node.x, node.y, node.text);
        setTextAttributes(text);
    }

    function drawRect(node) {
        var rect = paper.rect(node.x, node.y, constants.rectNodeWidth, constants.rectNodeHeight);
        setShapeAttributes(rect, node);

        var text = paper.text(node.x + constants.rectNodeWidth / 2, node.y + constants.rectNodeHeight / 2, node.text);
        setTextAttributes(text);
    }

    function setTextAttributes(text) {
        text.attr({stroke:'white'});
        text.click(function (event) {
            //TODO: Add event listener to figure
        });
    }

    function setShapeAttributes(shape, node) {
        shape.attr({
            fill: node.color,
            stroke: 'none',
        });

        //adding event to shape
        shape.click(function(event) {
            //TODO: Add event listener to figure
        });
    }


}