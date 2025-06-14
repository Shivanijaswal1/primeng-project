import { Component, Input, SimpleChanges } from '@angular/core';
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
  selector: 'app-configuration-based-form',
  templateUrl: './configuration-based-form.component.html',
  styleUrls: ['./configuration-based-form.component.scss'],
})
export class ConfigurationBasedFormComponent {
  @Input() formConfig!: FormSection;
  configForm: FormGroup = new FormGroup({});
  fields: FormField[] = [];
  sectionName: string = '';
  constructor(private _Service: ServiceService, private _fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formConfig'] && this.formConfig?.field) {
      this.sectionName = this.formConfig.sectionName;
      this.buildForm();
    }
  }

  buildForm(): void {
    this.fields = this.formConfig.field.sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
    const group: any = {};
    this.fields.forEach((field) => {
      group[field.field] = new FormControl('');
    });
    this.configForm = new FormGroup(group);
  }

  onSubmit(): void {
    console.log('Submitted values:', this.configForm.value);
  }
}
