import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvQueryComponent } from './hv-query.component';

describe('HvQueryComponent', () => {
  let component: HvQueryComponent;
  let fixture: ComponentFixture<HvQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvQueryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
