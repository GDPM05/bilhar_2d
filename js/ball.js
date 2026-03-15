
class Ball {
    
    constructor(x, y, color, type, number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.number = number;
        this.radius = 15;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = (this.color == "black" || this.color == "darkblue" || this.color == "blue") ? "white" : "black";
        const textShift = ctx.measureText(this.number);
        ctx.fillText(this.number, this.x - textShift.width / 2, this.y + 3);
    
        if (this.type == "big") {
            const whiteRatio = 8;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.ellipse(this.x, this.y + whiteRatio, this.radius - 1, this.radius - whiteRatio, Math.PI * 2, 0, Math.PI + (Math.PI * 0) / 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x, this.y - whiteRatio, this.radius - 1, this.radius - whiteRatio, Math.PI, 0, Math.PI + (Math.PI * 0) / 2);
            ctx.fill();
        }
    }

}
