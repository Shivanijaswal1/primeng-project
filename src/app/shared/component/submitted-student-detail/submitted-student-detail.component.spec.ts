import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedStudentDetailComponent } from './submitted-student-detail.component';

describe('SubmittedStudentDetailComponent', () => {
  let component: SubmittedStudentDetailComponent;
  let fixture: ComponentFixture<SubmittedStudentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmittedStudentDetailComponent]
    });
    fixture = TestBed.createComponent(SubmittedStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
