import { Component,Input,forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() model: any = '';
  @Input() name: string = '';
  @Input() required: boolean = true;
  @Input() type: string = 'text';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() placeholder: string = '';
 
  value: any;
  errorMessage: string ="";

  validateField(): void {
    if (!this.value || this.value.trim() === '') {
      this.errorMessage = `${this.label} is required.`;
    } else {
      this.errorMessage = '';
    }
  }
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
  }
    onBlur(): void {
    this.onTouched();
  }
}
