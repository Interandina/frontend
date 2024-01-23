import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteAppComponent } from './autocomplete-app.component';

describe('AutocompleteAppComponent', () => {
  let component: AutocompleteAppComponent;
  let fixture: ComponentFixture<AutocompleteAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
