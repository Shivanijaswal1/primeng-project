import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-student-detail-form',
  templateUrl: './student-detail-form.component.html',
  styleUrls: ['./student-detail-form.component.scss'],
})
export class StudentDetailFormComponent {
  @Input() data: any;
  @Output() formSubmit = new EventEmitter<any>();
  user = { name: '', email: '', age: null, id: null };

  constructor(public config: DynamicDialogConfig) {}
  ngOnInit() {
    if (this.config.data) {
      this.user = { ...this.config.data };
    }
  }
}
