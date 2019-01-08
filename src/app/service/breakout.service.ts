import { Injectable } from '@angular/core';
import { interval, merge, fromEvent, Observable, Subject } from 'rxjs';
import {
  map,
  scan,
  distinctUntilChanged,
  withLatestFrom,
  merge as OperatorMerge,
  retryWhen,
  delay,
  filter,
  tap
} from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { BreakoutCanvasService } from './breakout-canvas.service';
import { config } from '../config';

@Injectable()
export class BreakoutService {
  TICKER_INTERVAL = Math.ceil(1000 / 60);

  PADDLE_SPEED = 240;

  BALL_SPEED = 60;

  restart: Subject<any>;

  PADDLE_CONTROLS = {
    ArrowLeft: -1,
    ArrowRight: 1
  };

  ticker$ = interval(this.TICKER_INTERVAL, animationFrame).pipe(
    map(() => ({
      time: Date.now(),
      deltaTime: null
    })),
    scan((previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time) / 1000
    }))
  );

  key$ = merge(
    fromEvent(document, 'keydown').pipe(
      // filter(event => event['key'] !== ),
      map(event => this.PADDLE_CONTROLS[event['key']] || 0)
    ),
    fromEvent(document, 'keyup').pipe(map(event => 0))
  ).pipe(
    distinctUntilChanged(),
    tap(data => {
      // console.log('' + data);
    })
  );

  game$ = Observable.create(observer => {
    this.breakoutCanvasService.drawIntro();
    this.restart = new Subject();
    const paddle$ = this.createPaddle$(this.ticker$);
    const state$ = this.createState$(this.ticker$, paddle$);
    this.ticker$
      .pipe(
        withLatestFrom(paddle$, state$),
        OperatorMerge(this.restart)
      )
      .subscribe(observer);
  });

  createPaddle$(ticker$: Observable<{ time: number; deltaTime: any }>) {
    return ticker$.pipe(
      withLatestFrom(this.key$),
      scan<any[], number>((position: number, [ticker, direction]) => {
        const nextPosition =
          position + direction * ticker.deltaTime * this.PADDLE_SPEED;
        return Math.max(
          Math.min(
            nextPosition,
            this.breakoutCanvasService.stage.width - config.PADDLE_WIDTH / 2
          ),
          config.PADDLE_WIDTH / 2
        );
      }, this.breakoutCanvasService.stage.width / 2),
      distinctUntilChanged()
    );
  }

  createState$(ticker$, paddle$) {
    return ticker$.pipe(
      withLatestFrom(paddle$),
      scan<any[], { ball: Ball, bricks: Brick[], score: number}>(({ ball, bricks, score }, [ticker, paddle]) => {
        const remainingBricks = [];
        const collisions = {
          paddle: false,
          floor: false,
          wall: false,
          ceiling: false,
          brick: false
        };

        ball.position.x =
          ball.position.x +
          ball.direction.x * ticker.deltaTime * this.BALL_SPEED;
        ball.position.y =
          ball.position.y +
          ball.direction.y * ticker.deltaTime * this.BALL_SPEED;

        bricks.forEach(brick => {
          if (!this.isCollision(brick, ball)) {
            remainingBricks.push(brick);
          } else {
            collisions.brick = true;
            score = score + 10;
          }
        });

        collisions.paddle = this.isHit(paddle, ball);

        if (
          ball.position.x < config.BALL_RADIUS ||
          ball.position.x >
            this.breakoutCanvasService.stage.width - config.BALL_RADIUS
        ) {
          ball.direction.x = -ball.direction.x;
          collisions.wall = true;
        }

        collisions.ceiling = ball.position.y < config.BALL_RADIUS;

        if (collisions.brick || collisions.paddle || collisions.ceiling) {
          ball.direction.y = -ball.direction.y;
        }

        return {
          ball: ball,
          bricks: remainingBricks,
          collisions: collisions,
          score: score
        };
      }, this.initState())
    );
  }

  initState() {
    return {
      ball: {
        position: {
          x: this.breakoutCanvasService.stage.width / 2,
          y: this.breakoutCanvasService.stage.height / 2
        },
        direction: {
          x: 2,
          y: 2
        }
      },
      bricks: this.createBricks(),
      score: 0
    };
  }

  createBricks() {
    const width =
      (this.breakoutCanvasService.stage.width -
        config.BRICK_GAP -
        config.BRICK_GAP * config.BRICK_COLUMNS) /
      config.BRICK_COLUMNS;
    const bricks = [];
    for (let i = 0; i < config.BRICK_ROWS; i++) {
      for (let j = 0; j < config.BRICK_COLUMNS; j++) {
        bricks.push({
          x: j * (width + config.BRICK_GAP) + width / 2 + config.BRICK_GAP,
          y:
            i * (config.BRICK_HEIGHT + config.BRICK_GAP) +
            config.BRICK_HEIGHT / 2 +
            config.BRICK_GAP +
            20,
          width: width,
          height: config.BRICK_HEIGHT
        });
      }
    }
    return bricks;
  }

  isHit(paddle: number, ball: Ball) {
    return (
      ball.position.x > paddle - config.PADDLE_WIDTH / 2 &&
      ball.position.x < paddle + config.PADDLE_WIDTH / 2 &&
      ball.position.y >
        this.breakoutCanvasService.stage.height -
          config.PADDLE_HEIGHT -
          config.BALL_RADIUS / 2
    );
  }

  /**
   * collision 碰撞冲突
   * @param brick 砖块
   * @param ball 球
   */
  isCollision(brick: Brick, ball: Ball) {
    return (
      ball.position.x + ball.direction.x > brick.x - brick.width / 2 &&
      ball.position.x + ball.direction.x < brick.x + brick.width / 2 &&
      ball.position.y + ball.direction.y > brick.y - brick.height / 2 &&
      ball.position.y + ball.direction.y < brick.y + brick.height / 2
    );
  }

  updateView([ticker, paddle, state]) {
    this.breakoutCanvasService.context.clearRect(
      0,
      0,
      this.breakoutCanvasService.stage.width,
      this.breakoutCanvasService.stage.height
    );

    this.breakoutCanvasService.drawPaddle(paddle);
    this.breakoutCanvasService.drawBall(state.ball);
    this.breakoutCanvasService.drawBricks(state.bricks);
    this.breakoutCanvasService.drawScore(state.score);

    if (
      state.ball.position.y >
      this.breakoutCanvasService.stage.height - config.BALL_RADIUS
    ) {
      this.breakoutCanvasService.drawGameOver('GAME OVER');
      this.restart.error('game over');
    }
  }

  ready() {
    this.game$
      .pipe(
        retryWhen(err$ => {
          return err$.pipe(delay(1000));
        })
      )
      .subscribe(data => {
        this.updateView(data);
      });
  }

  constructor(private breakoutCanvasService: BreakoutCanvasService) {}
}

export class Brick {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class Ball {
  position: {
    x: number;
    y: number;
  };
  direction: {
    x: number;
    y: number;
  };
}
