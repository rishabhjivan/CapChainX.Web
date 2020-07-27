import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerConfirmTrxComponent } from './ledger-confirm-trx.component';

describe('LedgerConfirmTrxComponent', () => {
  let component: LedgerConfirmTrxComponent;
  let fixture: ComponentFixture<LedgerConfirmTrxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerConfirmTrxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerConfirmTrxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
