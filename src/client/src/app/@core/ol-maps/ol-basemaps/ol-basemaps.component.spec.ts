import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlBasemapsComponent } from './ol-basemaps.component';

describe('OlBasemapsComponent', () => {
  let component: OlBasemapsComponent;
  let fixture: ComponentFixture<OlBasemapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OlBasemapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OlBasemapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
