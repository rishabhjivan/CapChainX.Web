import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingScheduleComponent } from './pricing-schedule.component';

describe('PricingScheduleComponent', () => {
  let component: PricingScheduleComponent;
  let fixture: ComponentFixture<PricingScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
