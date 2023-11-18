import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAppComponent } from './table-app.component';

describe('TableAppComponent', () => {
  let component: TableAppComponent;
  let fixture: ComponentFixture<TableAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
