import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldinamicComponent } from './modaldinamic.component';

describe('ModaldinamicComponent', () => {
  let component: ModaldinamicComponent;
  let fixture: ComponentFixture<ModaldinamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldinamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaldinamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
