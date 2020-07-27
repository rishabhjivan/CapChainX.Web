import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLedgerModalComponent } from './transfer-ledger-modal.component';

describe('TransferLedgerModalComponent', () => {
  let component: TransferLedgerModalComponent;
  let fixture: ComponentFixture<TransferLedgerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferLedgerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLedgerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
