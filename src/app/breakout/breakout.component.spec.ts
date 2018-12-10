import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakoutComponent } from './breakout.component';

describe('BreakoutComponent', () => {
  let component: BreakoutComponent;
  let fixture: ComponentFixture<BreakoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
