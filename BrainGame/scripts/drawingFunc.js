function drawNode(paper, node) {
    if (node.shape === 'rect') {
        drawRect(paper, node);
    } else if (node.shape === 'circle') {
        drawCircle(paper, node);
    }
}

function drawCircle(paper, node) {
    var circle = paper.circle(node.x, node.y, constants.circleNodeRadius);
    setShapeAttributes(circle, node);
    setEvents(circle, node, circle);

    var text = paper.text(node.x, node.y, node.text);
    setTextAttributes(text);
    setEvents(text, node, circle);
}

function drawRect(paper, node) {
    var rect = paper.rect(node.x, node.y, constants.rectNodeWidth, constants.rectNodeHeight);
    setShapeAttributes(rect, node);
    setEvents(rect, node, rect);

    var text = paper.text(node.x + constants.rectNodeWidth / 2, node.y + constants.rectNodeHeight / 2, node.text);
    setTextAttributes(text);
    setEvents(text, node, rect);

}

function setTextAttributes(text) {
    text.attr({
        fill: 'white',
        stroke: 'white',
        "font-size": "12px"
    });
}

function setShapeAttributes(shape, node) {
    shape.attr({
        fill: node.color,
        stroke: 'none',
    });
}

function setEvents(obj, node, shape) {
    obj.hover(
        function () {
            shape.g = shape.glow(
            {
                width: 40,
                opacity: 0.7,
                offsetx: 0,
                offsety: 0,
                fill: false,
                color: node.color,
            });
        },
        function () {
            shape.g.remove();
        });

    obj.click(function (event) {
        //TODO: Add event listener to figure
    });
}