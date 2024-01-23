import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAppEditComponent } from './table-app-edit.component';

describe('TableAppEditComponent', () => {
  let component: TableAppEditComponent;
  let fixture: ComponentFixture<TableAppEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableAppEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAppEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
