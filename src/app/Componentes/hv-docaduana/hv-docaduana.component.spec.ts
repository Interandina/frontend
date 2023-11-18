import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvDocaduanaComponent } from './hv-docaduana.component';

describe('HvDocaduanaComponent', () => {
  let component: HvDocaduanaComponent;
  let fixture: ComponentFixture<HvDocaduanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvDocaduanaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvDocaduanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
