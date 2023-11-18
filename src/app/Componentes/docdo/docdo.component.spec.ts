import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocdoComponent } from './docdo.component';

describe('DocdoComponent', () => {
  let component: DocdoComponent;
  let fixture: ComponentFixture<DocdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocdoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
