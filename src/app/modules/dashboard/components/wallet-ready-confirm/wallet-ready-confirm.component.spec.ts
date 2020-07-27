import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletReadyConfirmComponent } from './wallet-ready-confirm.component';

describe('WalletReadyConfirmComponent', () => {
  let component: WalletReadyConfirmComponent;
  let fixture: ComponentFixture<WalletReadyConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletReadyConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletReadyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
