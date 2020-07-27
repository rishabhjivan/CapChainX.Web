import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectLedgerModalComponent } from './connect-ledger-modal.component';

describe('ConnectLedgerModalComponent', () => {
  let component: ConnectLedgerModalComponent;
  let fixture: ComponentFixture<ConnectLedgerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectLedgerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectLedgerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
