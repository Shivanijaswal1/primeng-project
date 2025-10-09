import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiaChoroplethComponent } from './india-choropleth.component';

describe('IndiaChoroplethComponent', () => {
  let component: IndiaChoroplethComponent;
  let fixture: ComponentFixture<IndiaChoroplethComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndiaChoroplethComponent]
    });
    fixture = TestBed.createComponent(IndiaChoroplethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
