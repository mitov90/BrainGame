////testing generate static and draw function
//var rightAnswer = 'right answer',
//    wrongAnswer = 'wrong answer',
//    answer = ['right answer', 'right answer', 'wrong answer', 'right answer'],
//    answer2 = ['right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'wrong answer', 'right answer', 'right answer', 'wrong answer'];
//    testAnswer = [],
//    currentCoords = {
//        x: 0,
//        y: 0
//    },
//    answersCount = {
//        right: 0,
//        wrong: 0
//    };

//for (var i = 0; i < answer.length; i++) {
//    generateStatistic(answer[i], testAnswer, currentCoords);
//}

(function () {
    var answersUpTilNow = [],
        currentCoords = {
            x: 0,
            y: 0
        };
    function generateStatistic(input) {
        var newCurrentCoords = {};
        if (input === 'right answer') {
            currentCoords.x += 1;
            currentCoords.y -= 1;
            answersCount.right += 1;
        }
        else if (input === 'wrong answer') {
            currentCoords.x += 1;
            currentCoords.y += 1;
            answersCount.wrong += 1
        }
        newCurrentCoords.x = currentCoords.x;
        newCurrentCoords.y = currentCoords.y;

        if (answersUpTilNow.length === 0) {
            answersUpTilNow.push(currentCoords);
        }


        answersUpTilNow.push(newCurrentCoords);
        drawStatistic(answersUpTilNow, answersCount);
    };


    function drawStatistic(coordsArray, answers) {
        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            offsetY = canvas.height / 2,
            offsetScale = 100,
            height = 2 * Math.abs(answers.right - answers.wrong),
            scale = 1 / height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        for (var i = 1; i < coordsArray.length; i++) {
            ctx.lineTo(coordsArray[i].x * offsetScale * scale, coordsArray[i].y * offsetScale * scale + offsetY);
        }
        ctx.stroke();
    }
}());