import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSortingComponent } from './advance-sorting.component';

describe('AdvanceSortingComponent', () => {
  let component: AdvanceSortingComponent;
  let fixture: ComponentFixture<AdvanceSortingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvanceSortingComponent]
    });
    fixture = TestBed.createComponent(AdvanceSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
