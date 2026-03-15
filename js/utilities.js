
function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var arrowLen = 25;

    const toxF = fromx + arrowLen - (tox - fromx);
    const toyF = fromy + arrowLen - (toy - fromy);

    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function shuffleBalls(array) {
    let n = array.length;
    console.log(n, array);
    while (n > 1) {
        n--;
        if(n == 10)
            continue;

        const randomIndex = Math.floor(Math.random() * n);

        [array[n], array[randomIndex]] = [array[randomIndex], array[n]];
    }
   
    console.log(array);
    return array;
}

function bubbleSort(array) {
    const n = array.length;

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n - i - 1; j++) {
            // console.log(array[j]);
            if(array[j].x > array[j + 1].x) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n - i - 1; j++) {
            if (array[j].x == array[j + 1].x && array[j].y > array[j + 1].y) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }

    return array;
}

document.addEventListener('wheel', function(event) {
    const reductionRate = 10;
    const dir = event.deltaY < 0;

    const parentEl = document.getElementsByClassName("cue")[0];
    const parentWidth = parentEl.getBoundingClientRect().width - 2; // -2 referente à border de 1 pixel
    
    const el = document.getElementsByClassName("cue_fill")[0];

    if (dir) 
        el.style.width = el.getBoundingClientRect().width * 1.1;
    else
        el.style.width = el.getBoundingClientRect().width / 1.1;
    
    console.log(el.getBoundingClientRect().width);
});

document.addEventListener('mousemove', function(event) {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
    // console.log(window.mouseX, window.mouseY);
})
