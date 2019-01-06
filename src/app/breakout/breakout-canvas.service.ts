import { Injectable } from '@angular/core';
import { BreakoutService } from './breakout.service';

@Injectable()
export class BreakoutCanvasService {

    context: any;
    stage: any;

    PADDLE_WIDTH = 100; // 浆
    PADDLE_HEIGHT = 20;

    BALL_RADIUS = 10; // 球

    BRICK_ROWS = 5; // 砖
    BRICK_COLUMNS = 7;
    BRICK_HEIGHT = 20;
    BRICK_GAP = 3; // 间隙

    public init(canvas: any): void {
        this.stage = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'green';
    }

    public drawIntro() {
        this.context.clearRect(0, 0, this.stage.width, this.stage.height);
        this.context.textAlign = 'center';
        this.context.font = '24px Courier New';
        this.context.fillText('Press [<] and [>]', this.stage.width / 2, this.stage.height / 2);
    }

    public drawGameOver(text) {
        this.context.clearRect(this.stage.width / 4, this.stage.height / 3, this.stage.width / 2, this.stage.height / 3);
        this.context.textAlign = 'center';
        this.context.font = '24px Courier New';
        this.context.fillText(text, this.stage.width / 2, this.stage.height / 2);
    }

    public drawScore(score: number) {
        this.context.textAlign = 'left';
        this.context.font = '24px Courier New';
        this.context.fillText(score, this.BRICK_GAP, 16);
    }

    public drawPaddle(position) {
        this.context.beginPath();
        this.context.rect(
            position - this.PADDLE_WIDTH / 2,
            this.context.canvas.height - this.PADDLE_HEIGHT,
            this.PADDLE_WIDTH,
            this.PADDLE_HEIGHT
        );
        this.context.fill();
        this.context.closePath();
    }

    public drawBall(ball: any) {
        this.context.beginPath();
        this.context.arc(ball.position.x, ball.position.y, this.BALL_RADIUS, 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }

    public drawBrick(brick) {
        this.context.beginPath();
        this.context.rect(
            brick.x - brick.width / 2,
            brick.y - brick.height / 2,
            brick.width,
            brick.height
        );
        this.context.fill();
        this.context.closePath();
    }

    public drawBricks(bricks) {
        bricks.forEach(brick => this.drawBrick(brick));
    }

    constructor() {
    }
}
