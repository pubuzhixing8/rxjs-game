import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BreakoutCanvasService } from './breakout-canvas.service';
import { BreakoutService } from './breakout.service';

@Component({
  selector: 'app-breakout',
  templateUrl: './breakout.component.html',
  styleUrls: ['./breakout.component.scss']
})
export class BreakoutComponent implements OnInit, AfterViewInit {

  @ViewChild('stage')
  stage: ElementRef;

  constructor(
    public canvasService: BreakoutCanvasService,
    public breakoutService: BreakoutService
  ) { }


  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const stageCanvas = this.stage.nativeElement;
    this.canvasService.init(stageCanvas);
    this.breakoutService.ready();
  }
}
