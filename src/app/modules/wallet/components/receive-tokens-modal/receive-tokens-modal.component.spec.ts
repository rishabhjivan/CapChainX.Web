import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveTokensModalComponent } from './receive-tokens-modal.component';

describe('ReceiveTokensModalComponent', () => {
  let component: ReceiveTokensModalComponent;
  let fixture: ComponentFixture<ReceiveTokensModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveTokensModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveTokensModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
