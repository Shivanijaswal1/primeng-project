import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-assignment-dialog',
  templateUrl: './add-assignment-dialog.component.html',
})
export class AddAssignmentDialogComponent {
  assignment = {
    title: '',
    description: '',
    dueDate: '',
    studentIds: [] as number[]
  };
  students: any[] = [];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.students = config.data?.students || [];
  }

  submit() {
    if (this.assignment.title && this.assignment.dueDate && this.assignment.studentIds.length > 0) {
      this.ref.close(this.assignment);
    }
  }
}
