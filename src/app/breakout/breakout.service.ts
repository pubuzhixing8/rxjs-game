import { Injectable } from '@angular/core';

@Injectable()
export class BreakoutService {
  PADDLE_WIDTH = 100;
  PADDLE_HEIGHT = 20;

  BALL_RADIUS = 10;

  BRICK_ROWS = 5;
  BRICK_COLUMNS = 7;
  BRICK_HEIGHT = 20;
  BRICK_GAP = 3;
}
