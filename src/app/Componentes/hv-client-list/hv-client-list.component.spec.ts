import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvClientListComponent } from './hv-client-list.component';

describe('HvClientListComponent', () => {
  let component: HvClientListComponent;
  let fixture: ComponentFixture<HvClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvClientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
