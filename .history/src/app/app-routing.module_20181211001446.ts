import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  } from './breakout/breakout.component';

const routes: Routes = [
  { path: 'breakout', component:  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
