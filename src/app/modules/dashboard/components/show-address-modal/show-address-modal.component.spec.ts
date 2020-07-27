import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAddressModalComponent } from './show-address-modal.component';

describe('ShowAddressModalComponent', () => {
  let component: ShowAddressModalComponent;
  let fixture: ComponentFixture<ShowAddressModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAddressModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
