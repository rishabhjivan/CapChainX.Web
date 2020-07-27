import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenWaitComponent } from './token-wait.component';

describe('TokenWaitComponent', () => {
  let component: TokenWaitComponent;
  let fixture: ComponentFixture<TokenWaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenWaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
