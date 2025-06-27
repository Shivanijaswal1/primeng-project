import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface FormField {
  field: string;
  fieldName: string;
  editable: boolean;
  displayOrder: number;
  type: string;
  options?: string[];
  required: boolean;
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
   parentId: any;
  @Input() formConfig!: FormSection;
  configForm: FormGroup = new FormGroup({});
  fields: FormField[] = [];
  sectionName: string = '';
  formSubmitted: boolean = false;
  
  @Output() childAdded = new EventEmitter<any>();
  constructor(private _Service: ServiceService, private _fb: FormBuilder, public ref: DynamicDialogRef,  public config: DynamicDialogConfig,) {}


    ngOnInit(): void {
    this.parentId = this.config.data?.parentId;
    console.log('Received parentId:', this.parentId);
  }
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
    this.formSubmitted = true;
    if (this.configForm.invalid) {
      return;
    }
    const formData = { ...this.configForm.value, parentId: this.parentId };
    if (this.ref) {
      this.ref.close(formData);
      console.log('Form submitted:', formData);
    }
  }
  
  }


