import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvClientComponent } from './hv-client.component';

describe('HvClientComponent', () => {
  let component: HvClientComponent;
  let fixture: ComponentFixture<HvClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
