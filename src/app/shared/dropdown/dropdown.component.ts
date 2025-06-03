import { Component,Input,Output,EventEmitter,forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  values: any;
  @Input() label!: string;
  @Input() options: any[] = [];
  @Input() required: boolean = false;
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  onInputChange(event: any) {
    this.valueChange.emit(event.value);
  }
  errorMessage: string ="";

  validateField(): void {
    if (!this.value || this.value.trim() === '') {
      this.errorMessage = `${this.label} is required.`;
    } else {
      this.errorMessage = '';
    }
  }
 writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
 
  }

  onChange = (_: any) => {};
  onTouched = () => {};


  onSelect(value: any) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }


}
