import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvFinalComponent } from './hv-final.component';

describe('HvFinalComponent', () => {
  let component: HvFinalComponent;
  let fixture: ComponentFixture<HvFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
