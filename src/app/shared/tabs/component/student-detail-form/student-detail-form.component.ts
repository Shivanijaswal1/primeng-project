import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ServiceService } from '../../service/service.service';

type User = {
  id: string | null;
  name: string;
  email: string;
  age: number | null;
};

type UserField = {
  label: string;
  name: keyof User;
  type: string;
  required: boolean;
  min?: number;
  max?: number;
  errorMsg: string;
  defaultValue?: any;
};

@Component({
  selector: 'app-student-detail-form',
  templateUrl: './student-detail-form.component.html',
  styleUrls: ['./student-detail-form.component.scss'],
}) 
export class StudentDetailFormComponent {
//  @Output() formSubmit = new EventEmitter<any>();
 user: { [key: string]: any } = {};
 formFields: UserField[] = [];

  constructor(
    public config: DynamicDialogConfig,
    private _formConfigService: ServiceService,
     public dialogRef: DynamicDialogRef,
  ) {}

 ngOnInit(): void {
    this.formFields = this._formConfigService.getUserFormFields();
    debugger
    if (this.config?.data) {
      this.user = { ...this.config.data };
    }
  }

  submitform(){
    if(Object.keys(this.user).length) {
    this.dialogRef.close({ policy: [this.user] });
  }
  }
}
