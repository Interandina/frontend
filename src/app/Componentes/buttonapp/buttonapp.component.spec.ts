import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonappComponent } from './buttonapp.component';

describe('ButtonappComponent', () => {
  let component: ButtonappComponent;
  let fixture: ComponentFixture<ButtonappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
