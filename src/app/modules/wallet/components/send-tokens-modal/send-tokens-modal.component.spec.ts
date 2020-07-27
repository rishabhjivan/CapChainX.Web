import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTokensModalComponent } from './send-tokens-modal.component';

describe('SendTokensModalComponent', () => {
  let component: SendTokensModalComponent;
  let fixture: ComponentFixture<SendTokensModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTokensModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTokensModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
