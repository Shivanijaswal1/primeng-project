import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailTableComponent } from './student-detail-table.component';

describe('StudentDetailTableComponent', () => {
  let component: StudentDetailTableComponent;
  let fixture: ComponentFixture<StudentDetailTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailTableComponent]
    });
    fixture = TestBed.createComponent(StudentDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
