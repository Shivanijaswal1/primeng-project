import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailFormComponent } from './student-detail-form.component';

describe('StudentDetailFormComponent', () => {
  let component: StudentDetailFormComponent;
  let fixture: ComponentFixture<StudentDetailFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDetailFormComponent]
    });
    fixture = TestBed.createComponent(StudentDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
