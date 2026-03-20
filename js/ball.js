
class Ball {
    
    constructor(x, y, color, type, number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.number = number;
        
        this.radius = 15;
        this.ball_mass = 0.017; // gramas
        this.moving = false;
        this.xAcceleration = 0;
        this.yAcceleration = 0;

        this.xDirection = 1;
        this.yDirection = 1;

        this.startedMoving;
        this.stoppedMoving;
    }
    
    update() {
         
        if(this.moving) {
            this.x += this.xAcceleration * this.xDirection;
            this.y += this.yAcceleration * this.yDirection;
           
            const slideDrag = this.calculateSlideDrag();

            if(this.xAcceleration < 0) {
                this.xAcceleration *= slideDrag;
            } else {
                this.xAcceleration /= slideDrag;
            }

            if(this.yAcceleration < 0) {
                this.yAcceleration *= slideDrag;
            } else {
                this.yAcceleration /= slideDrag;
            }
            
            if (this.xAcceleration > -1 && this.xAcceleration < 0)
                this.xAcceleration = 0;
            if (this.yAcceleration > -1 && this.yAcceleration < 0)
                this.yAcceleration = 0;


            if(this.xAcceleration == 0 && this.yAcceleration == 0) {
                this.xDirection = 1;
                this.yDirection = 1;
                this.moving = false;
            }
    
        }

    }

    checkCollisions(width, height) {
        if(this.x <= 0 + this.radius || this.x >= width - this.radius) {
            this.xDirection *= -1;
        } 
        if(this.y <= 0 + this.radius || this.y >= height - this.radius) {
            this.yDirection *= -1;
        }
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
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x, this.y - whiteRatio, this.radius - 1, this.radius - whiteRatio, Math.PI, 0, Math.PI + (Math.PI * 0) / 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    move(xDir, yDir) {
        this.x += xDir;
        this.y += yDir;
    }
    
    getDeltaPos(xFinal, yFinal) {
        const deltaX = xFinal - this.x;
        const deltaY = yFinal - this.y;

        return [deltaX, deltaY];
    }
       

    calculateAcceleration(cue_hit_force) {
        const acceleration = cue_hit_force * this.ball_mass;
        return acceleration;
    }

    calculateSlideDrag() {
        const kinetic_friction = 2;
        const g = 9.8;

        const drag = kinetic_friction * this.ball_mass * g;
        return drag;
    }

    calculateRollDrag() {
        const roll_drag = 0.015;
        const g = 9.8;

        const drag = roll_drag * this.ball_mass * g;
        return drag;
    }
}
