import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocanexosFormComponent } from './docanexos-form.component';

describe('DocanexosFormComponent', () => {
  let component: DocanexosFormComponent;
  let fixture: ComponentFixture<DocanexosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocanexosFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocanexosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
