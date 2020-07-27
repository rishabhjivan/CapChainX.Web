import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSaleDashboardHelpModalComponent } from './token-sale-dashboard-help-modal.component';

describe('TokenSaleDashboardHelpModalComponent', () => {
  let component: TokenSaleDashboardHelpModalComponent;
  let fixture: ComponentFixture<TokenSaleDashboardHelpModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenSaleDashboardHelpModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenSaleDashboardHelpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
