import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.scss']
})
export class AttendancePageComponent {
 attendanceForm!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const students = this.config.data.students || [];
    this.attendanceForm = this.fb.group({
      attendance: this.fb.array(
        students.map((s: { name: any; }) => this.fb.group({ name: s.name, present: [false] }))
      )
    });
  }

  get attendanceArray(): FormArray {
    return this.attendanceForm.get('attendance') as FormArray;
  }

  submitAttendance() {
    const data = this.attendanceForm.value.attendance;
    this.ref.close(data);
  }

  cancel() {
    this.ref.close();
  }

getAvatar(name: string): string {
  const initials = name.split(' ').map(n => n[0]).join('');
  return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=64`;
}

}
