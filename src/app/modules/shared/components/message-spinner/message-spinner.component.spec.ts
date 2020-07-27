import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSpinnerComponent } from './message-spinner.component';

describe('MessageSpinnerComponent', () => {
  let component: MessageSpinnerComponent;
  let fixture: ComponentFixture<MessageSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
