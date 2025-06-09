import { Component, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/core/service.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
@ViewChild('dropdownElem') dropdownElem: any;
  name: string = '';
  email: string = '';
  age: number | null = null;
  Father: string = '';
  parent: string = '';
  child: string = '';
  dataService: any;
  formData: any = {};
  payload: {} | undefined;
  selectedValue: any;
  parentOptions: any[] = [];
  childOptions: any[] = [];
  selectedParent: string = '';
  selectedChild: any;
  selectedParentId: number = 0;
  isEditable: boolean = false;
  newChildValue: string = '';
  isTyping: boolean = false;
  childExistsError: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    private _service: ServiceService,
    private _mesaage: MessageService
  ) {}

  ngOnInit(): void {
    this._service.getDummyData().subscribe((data) => {
      this.parentOptions = data;
      this.childOptions = data.children;
    });
  }


  onParentChange(event: any): void {
    const selected = this.parentOptions.find((p) => p.key === event.value);
    if (selected) {
      this.selectedParent = selected.key;
      this.childOptions = selected.children || [];
    } else {
      this.selectedParent = '';
      this.childOptions = [];
    }
    this.selectedChild = null;
  }

  dropdownOptions = [
    { name: 'ART', code: 'O1' },
    { name: 'Medical', code: 'O2' },
    { name: 'Commerce', code: 'O3' },
  ];

  handleValueChange(value: any) {
    this.selectedValue = value;
  }

  closeDialog() {
    this.ref.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.payload = {
        name: this.name,
        email: this.email,
        age: this.age,
        selectedValue: this.selectedValue ? this.selectedValue.name : null,
        father: this.Father,
      };
      this._service.addData(this.payload).subscribe({
        next: (response: any) => {
          this.formData = {};
          this._mesaage.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
          });
          form.reset();
          this.ref.close();
        },
        error: (error: any) => {
          console.error('Error submitting data', error);
        },
      });
    } else {
      form.control.markAllAsTouched();
      this._mesaage.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Message Content',
      });
    }
  }

 DropdownEditable() {
    this.isEditable = true;
    this.selectedChild = '';
    const input = this.getInput();
    if (input) {
      input.value = '';
        setTimeout(() => {
      input.focus();
    }, 0)
    }
  }


  onDropdownChange(event: any) {
    const selectedKey = event.value;
    const option = this.childOptions.find(opt => opt.key === selectedKey);
    if (option) {
      this.selectedChild = selectedKey;
      this.isEditable = false;
      const input = this.getInput();
      if (input) {
        input.value = option.value;
      }
    }
  }


  onDropdownBlur() {
  const input = this.getInput();
  const typedValue = input?.value?.trim();
  if (!typedValue) {
    this.isEditable = false;
    return;
  }
  const existingOption = this.childOptions.find(
    opt => opt.value.toLowerCase() === typedValue.toLowerCase()
  );
  if (existingOption) {
    this.selectedChild = existingOption.key;
    input!.value = existingOption.value;
  } else {
    const newKey = Date.now().toString();
    const newOption = { key: newKey, value: typedValue };
    this.childOptions.push(newOption);
    this.selectedChild = newKey;
    input!.value = newOption.value;
  }
  this.isEditable = true;
}


  private getInput(): HTMLInputElement | null {
    return this.dropdownElem?.el?.nativeElement.querySelector('input') || null;
  }
  
}



