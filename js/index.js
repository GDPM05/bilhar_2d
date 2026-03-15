
window.addEventListener('load', (event) => {
    console.log("Page fully loaded.");

    const canvas = document.getElementById("mesa");
    const ctx = canvas.getContext("2d");

    const height = canvas.getAttribute("height");
    const width = canvas.getAttribute("width");
    console.log("height -> width", height, width);

    // buracos da mesa
    tableHoles(ctx, width, height);

    //drawTableTriangle(ctx, width, height);
    //drawTriangleGrid(ctx, width, height);
    const positions = mapBallsInitialPosition(ctx, width, height);
    generateBalls(ctx, positions);
});

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

            const finalX = (gridStart.x + i) + ballRadius + gridXShift;
            const finalY = (gridY + ((ballRadius * 2) * j)) + ballRadius;

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

    for (let i = 1; i < 16; i++) {
        const p = positionsList[i - 1];
        const ball = new Ball(p.x, p.y, colors[i-1], (i <= 8) ? "small" : "big", i); 
        ball.draw(ctx);
    }

}

function shuffleBalls(array) {
    let n = array.length;

    while (n > 1) {
        
        const randomIndex = Math.floor(Math.random() * n);
        n--;

        [array[n], array[randomIndex]] = [array[randomIndex], array[n]];
    }
    
    return array;
}
