import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensTosModalComponent } from './tokens-tos-modal.component';

describe('TokensTosModalComponent', () => {
  let component: TokensTosModalComponent;
  let fixture: ComponentFixture<TokensTosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokensTosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokensTosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
