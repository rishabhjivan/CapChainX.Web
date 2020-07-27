import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateTokensComponent } from './activate-tokens.component';

describe('ActivateTokensComponent', () => {
  let component: ActivateTokensComponent;
  let fixture: ComponentFixture<ActivateTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
