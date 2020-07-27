import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIcoConfirmComponent } from './create-ico-confirm.component';

describe('CreateIcoConfirmComponent', () => {
  let component: CreateIcoConfirmComponent;
  let fixture: ComponentFixture<CreateIcoConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIcoConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIcoConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
