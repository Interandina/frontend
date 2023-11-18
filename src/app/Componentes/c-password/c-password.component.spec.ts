import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPasswordComponent } from './c-password.component';

describe('CPasswordComponent', () => {
  let component: CPasswordComponent;
  let fixture: ComponentFixture<CPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
