function createGraph(container,width,height) {
    var xStep = 10;
    var nextPoint = 10;

    var stage = new Kinetic.Stage({
        container: container,
        width: width,
        height: height
    });

    var layer = new Kinetic.Layer();
    var a = 5;
    var line = new Kinetic.Line({
        points: [
            0, 10
        ],
        stroke: 'red',
        tension: 0.5
    });

    var points = [];
    points.push(0);
    points.push(10);

    layer.add(line);
    stage.add(layer);

    var anim = new Kinetic.Animation(function() {
        line.setPoints(points);
    }, layer);

    anim.start();

    return {
        drawPoint:drawPoint
    }

    function drawPoint(y) {
        points.push(nextPoint);

        if (nextPoint < width) {nextPoint += xStep};

        points.push(y);

        if (line.attrs.points.length > width / xStep) {
            points.shift();
            points.shift();
            for (var i = 0; i < line.attrs.points.length; i+= 2) {
                line.attrs.points[i] -= xStep;
            }
        }

    }
}
