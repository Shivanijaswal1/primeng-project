import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ServiceService } from '../../service/service.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
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
  message: string = 'Please Complete all required fields';

  constructor(
    private _Service: ServiceService,
    private _fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dialogService: DialogService
  ) {}


ngOnInit(): void {
  this.parentId = this.config.data?.parentId;
  this.buildForm(); 
}

buildForm(): void {
  this.fields = this.formConfig.field.sort((a, b) => a.displayOrder - b.displayOrder);
  this.configForm = this._fb.group({
    policy: this._fb.array([]),
  });
  this.addPolicy(); 
}

addPolicy(): void {
  const policies = this.getPolicyArray();
  if (policies.length >= 3) return;
  const policyGroup = this._fb.group({});
  this.fields.forEach(field => {
    policyGroup.addControl(
      field.field,
      this._fb.control('', field.required ? Validators.required : null)
    );
  });
  policies.push(policyGroup);
}

getPolicyArray(): FormArray {
  return this.configForm.get('policy') as FormArray;
}

removePolicy(index: number): void {
  const policies = this.getPolicyArray();
  if (policies.length > 1) {
    policies.removeAt(index);
  }
}

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.configForm.invalid) {
      this.ref = this.dialogService.open(DialogMessageComponent, {
        header: 'Error',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        width: '30%',
        styleClass: 'custom-dialog-header',
        data: { message: this.message },
      });
      return;
    }
    const today = new Date();
    const dayOfWeek = today.getDay();
    let message: string;
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      message = '🎉 Great! Your form has been submitted successfully!';
    } else {
      message = '📝 Form submitted successfully! Response expected on Monday.';
    }
    const formData = { ...this.configForm.value, parentId: this.parentId };
    if (this.ref){ 
      this.ref.close(formData);
      console.log('Form submitted:', formData);
    }
    this.ref = this.dialogService.open(DialogMessageComponent, {
      header: 'Message',
      contentStyle: { overflow: 'auto' },
      styleClass: 'custom-dialog-header',
      data: { message: message, formData: formData },
    });   
  }
}
