import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamComponent } from './param.component';

describe('ParamComponent', () => {
  let component: ParamComponent;
  let fixture: ComponentFixture<ParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
