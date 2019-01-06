import { Injectable } from '@angular/core';
import { interval, merge, fromEvent, Observable } from 'rxjs';
import { map, scan, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { BreakoutCanvasService } from './breakout-canvas.service';

@Injectable()
export class BreakoutService {
  PADDLE_WIDTH = 100; // 浆
  PADDLE_HEIGHT = 20;

  BALL_RADIUS = 10; // 球

  BRICK_ROWS = 5; // 砖
  BRICK_COLUMNS = 7;
  BRICK_HEIGHT = 20;
  BRICK_GAP = 3; // 间隙

  TICKER_INTERVAL = Math.ceil(1000 / 60);

  ticker$ = interval(this.TICKER_INTERVAL, animationFrame)
    .pipe(map(() => ({
      time: Date.now(),
      deltaTime: null
    })), scan((previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time)
    })));
  PADDLE_CONTROLS = {
    'ArrowLeft': -1,
    'ArrowRight': 1
  };

  PADDLE_SPEED = 240;

  // init() {
  key$ = merge(
    fromEvent(document, 'keydown').pipe(map(event => (this.PADDLE_CONTROLS[event['key']] || 0))),
    fromEvent(document, 'keyup').pipe(map(event => (0)))
  ).pipe(distinctUntilChanged());
  // }

  createPaddle$ = (ticker$: Observable<{ time: number, deltaTime: any }>) => ticker$.pipe(withLatestFrom(this.key$),
    scan<any, number>((position: number, [ticker, direction]) => {
      const nextPosition = position + direction * ticker.deltaTime * this.PADDLE_SPEED;
      return Math.max(Math.min(nextPosition, this.breakoutCanvasService.stage.width - this.PADDLE_WIDTH / 2), this.PADDLE_WIDTH / 2);
    }, this.breakoutCanvasService.stage.width / 2))


  constructor(private breakoutCanvasService: BreakoutCanvasService) { }
}
