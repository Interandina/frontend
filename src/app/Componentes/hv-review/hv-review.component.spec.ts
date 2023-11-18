import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HvReviewComponent } from './hv-review.component';

describe('HvReviewComponent', () => {
  let component: HvReviewComponent;
  let fixture: ComponentFixture<HvReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HvReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HvReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
