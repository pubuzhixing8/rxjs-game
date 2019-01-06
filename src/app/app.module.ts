import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BreakoutComponent } from './breakout/breakout.component';
import { BreakoutCanvasService } from './breakout/breakout-canvas.service';
import { BreakoutService } from './breakout/breakout.service';

@NgModule({
  declarations: [
    AppComponent,
    BreakoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [BreakoutCanvasService, BreakoutService],
  bootstrap: [AppComponent]
})
export class AppModule { }
