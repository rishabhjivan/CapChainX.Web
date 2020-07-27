import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesProgressComponent } from './sales-progress.component';

describe('SalesProgressComponent', () => {
  let component: SalesProgressComponent;
  let fixture: ComponentFixture<SalesProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
