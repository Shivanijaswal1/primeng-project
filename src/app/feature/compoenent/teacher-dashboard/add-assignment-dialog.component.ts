import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-assignment-dialog',
  templateUrl: './add-assignment-dialog.component.html',
    styleUrls: ['./add-assignment-dialog.component.scss'],
})
export class AddAssignmentDialogComponent {
assignmentForm!: FormGroup;
  students: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder
  ) {
    this.students = config.data.students || [];

    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      className: ['', Validators.required],
      dueDate: [null, Validators.required]
    });
  }

  submit() {
    if (this.assignmentForm.valid) {
      this.ref.close(this.assignmentForm.value);
    }
  }

  cancel() {
    this.ref.close();
  }
}
