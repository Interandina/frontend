import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocanexosComponent } from './docanexos.component';

describe('DocanexosComponent', () => {
  let component: DocanexosComponent;
  let fixture: ComponentFixture<DocanexosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocanexosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocanexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
