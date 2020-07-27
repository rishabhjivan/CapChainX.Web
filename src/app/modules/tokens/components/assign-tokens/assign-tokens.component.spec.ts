import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTokensComponent } from './assign-tokens.component';

describe('AssignTokensComponent', () => {
  let component: AssignTokensComponent;
  let fixture: ComponentFixture<AssignTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
