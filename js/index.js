
const CUE_MAX_PULL = 400;
const CUE_MAX_FORCE = 3100;

window.addEventListener('load', (event) => {
    console.log("Page fully loaded.");
    
    const canvas = document.getElementById("mesa");
    const ctx = canvas.getContext("2d");

    const height = canvas.getAttribute("height");
    const width = canvas.getAttribute("width");
    console.log("height -> width", height, width);

    // buracos da mesa
    tableHoles(ctx, width, height);
    
    let mouseMove = true;

    const [balls, whiteBall] = initiateGame(ctx, width, height);
    console.log(balls, whiteBall);

    let toX;
    let toY;
    
    let mouseStart;
    let mouseEnd;

    let forcePercentage;

    setInterval(function() {
        clearPlane(ctx, width, height);
        tableHoles(ctx, width, height);

        whiteBall.draw(ctx);

        balls.forEach(ball => {
            ball.draw(ctx);
        });

        if(mouseMove) {

            const arrowLen = 50;

            const [deltaX, deltaY] = whiteBall.getDeltaPos(window.mouseX, window.mouseY);

            let rad = Math.atan2(deltaY, deltaX);
        
            toX = whiteBall.x + (arrowLen * Math.cos(rad));
            toY = whiteBall.y + (arrowLen * Math.sin(rad));

        } else {
            mouseEnd = window.mouseX;
            
            const distanceTraveled = Math.min(mouseEnd - mouseStart, CUE_MAX_PULL);

            if (0 < distanceTraveled) {
                console.log(distanceTraveled);
                forcePercentage = (distanceTraveled / CUE_MAX_PULL) * 100;
                console.log(forcePercentage);
                window.fillCuePercentage(forcePercentage);
            }   
                
        }

        ctx.beginPath();
        canvas_arrow(ctx, whiteBall.x, whiteBall.y, toX, toY);
        ctx.stroke();
            
    }, 16); 

    window.addEventListener("mousedown", function(event){
        mouseMove = false;
        mouseStart = window.mouseX;
    });

    window.addEventListener("mouseup", function(event) {
        mouseMove = true;
        document.getElementById("cue_fill").style.width = "0%";
    
        console.log("force: ", Math.min((forcePercentage / 100), 1));

        const cue_hit_force = CUE_MAX_FORCE * Math.min((forcePercentage / 100), 1);
        console.log(whiteBall.calculateAcceleration(cue_hit_force));
    }); 
});

function clearPlane(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
}

function initiateGame(ctx, w, h) {
    const positions = mapBallsInitialPosition(ctx, w, h);
    // drawTableTriangle(ctx, w, h);
    // drawTriangleGrid(ctx, w, h);
    const balls = generateBalls(ctx, positions);
    const whiteBall = generateWhiteBall(ctx, w, h);

    return [balls, whiteBall]
}

function tableHoles(ctx, w, h) {
    const holeRadius = 50;

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(0, 0, holeRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w, h, holeRadius, 0, 2 * Math.PI);    
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w, 0, holeRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, h, holeRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((w / 2), 0, holeRadius - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((w / 2), h, holeRadius - 2, 0, 2* Math.PI);
    ctx.fill();
}

function drawTableTriangle(ctx, w, h) {
    const ballRadius = 15; 
    const triangleSide = (ballRadius * 2) * 5;

    ctx.beginPath();
    ctx.moveTo(w/7, h/2 - triangleSide / 2);
    ctx.lineTo(w/7, h/2 + triangleSide / 2);
    ctx.lineTo(w / 7 + triangleSide, h / 2);
    ctx.lineTo(w / 7, h / 2 - triangleSide / 2);
    ctx.stroke();
}

function drawTriangleGrid(ctx, w, h) {
    const ballRadius = 15;
    const gridSide = (ballRadius * 2) * 5;
    
    ctx.strokeStyle = "red";
    ctx.strokeRect(w / 7, h / 2 - gridSide / 2, gridSide, gridSide);
    
    const gridStart = {
        x: w / 7,
        y: h / 2 - gridSide / 2
    };
    
    for(let i = 0; i < gridSide; i += (ballRadius * 2)) {
        for(let j = 0; j < gridSide; j += (ballRadius * 2)) {
            ctx.strokeRect(gridStart.x + i, gridStart.y + j, ballRadius * 2, ballRadius * 2);
        }
    }
}

function mapBallsInitialPosition(ctx, w, h) {
    let positionsMap = [];
    const ballRadius = 15;
    const gridSide = (ballRadius * 2) * 5
    const gridStart = {
        x: w / 7,
        y: h / 2 - gridSide / 2
    };
    
    let colN = 0;

    for(let i = 0; i < gridSide; i += (ballRadius * 2)) {
        let colNBalls = 5 - colN;
        colN += 1;
        for(let j = 0; j < colNBalls; j += 1) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            const gridY = gridStart.y + ((ballRadius * 2) * ((5 - colNBalls) / 2));
            const gridXShift = (colN > 1) ? - 4 * (colN - 1) : 0;
            console.log(gridY, (gridStart.x + i) + ballRadius);                

            const finalX = Math.floor((gridStart.x + i) + ballRadius + gridXShift);
            const finalY = (gridY + ((ballRadius * 2) * j)) + ballRadius - 7;

            ctx.arc(
                (gridStart.x + i) + ballRadius + gridXShift,
                (gridY + ((ballRadius * 2) * j)) + ballRadius,
                1, 0, 2 * Math.PI);
            ctx.fill();

            positionsMap.push({x: finalX, y: finalY});
        }
    }

    return positionsMap;
}

function generateBalls(ctx, positionsList) {
   
    const colors = [
        "yellow", "blue", "red", "darkblue", "orange", "green", "brown", "black",
        "yellow", "blue", "red", "darkblue", "orange", "green", "brown", "white"
    ];   

    shuffleBalls(positionsList);

    let ballsMap = [];

    for (let i = 1; i < 16; i++) {
        const p = positionsList[i - 1];
        const ball = new Ball(p.x, p.y, colors[i-1], (i <= 8) ? "small" : "big", i); 
        ballsMap.push(ball);
    }

    ballsMap = bubbleSort(ballsMap);
    
    if(ballsMap[10].number !== 8)  {
        let eightBallPos = 0;
        for(let i = 0; i < ballsMap.length; i++) {
            if (ballsMap[i].number == 8)
                eightBallPos = i;
        }

        console.log(ballsMap[10], ballsMap[eightBallPos]);

        let temp = ballsMap[10];
        let tempX = temp.x;
        let tempY = temp.y;
        let tempEight = ballsMap[eightBallPos];
        temp.x = tempEight.x;
        temp.y = tempEight.y;
        tempEight.x = tempX;
        tempEight.y = tempY;
        ballsMap[10] = tempEight;
        ballsMap[eightBallPos] = temp;
    }
    
    return ballsMap;
}

function generateWhiteBall(ctx, w, h) {
    
    const ballRadius = 15;

    const ballX = w - (w / 5);
    const ballY = (h / 2) - (ballRadius / 2);

    const whiteBall = new Ball(ballX, ballY, "white", "whiteball", "");
    whiteBall.draw(ctx);

    return whiteBall;
}


