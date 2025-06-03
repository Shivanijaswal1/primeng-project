
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../../service/service.service';

export interface FormField {
  field: string;
  fieldName: string;
  editable: boolean;
  displayOrder: number;
  type: string;
  options?: string[];
}

export interface FormSection {
  section: string;
  sectionName: string;
  field: FormField[];
}
@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss']
})
export class ConfigFormComponent {
 @Input() formConfig!: FormSection; 
  configForm: FormGroup = new FormGroup({});
  fields: any[] = [];
  
 constructor(private _Service:ServiceService,private _fb:FormBuilder){}

ngOnChanges(changes: SimpleChanges) {
  if (changes['formConfig'] && changes['formConfig'].currentValue) {
    this.buildForm();
  }
}


 buildForm(): void {
  if (!this.formConfig || !Array.isArray(this.formConfig.field)) {
    console.warn('formConfig is invalid:', this.formConfig);
    return;
  }

  const group: any = {};
  this.fields = this.formConfig.field.sort((a, b) => a.displayOrder - b.displayOrder);

  this.fields.forEach((field) => {
    group[field.field] = new FormControl('');
  });

  this.configForm = new FormGroup(group);
}

  onSubmit(): void {
    console.log('Form submitted:', this.configForm.value);
  }
}
