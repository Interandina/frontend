import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloaddocsComponent } from './downloaddocs.component';

describe('DownloaddocsComponent', () => {
  let component: DownloaddocsComponent;
  let fixture: ComponentFixture<DownloaddocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloaddocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloaddocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
