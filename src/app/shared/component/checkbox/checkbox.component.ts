import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input() label: string = '';

  onCheckboxChange(event: any) {
    this.checkedChange.emit(this.checked);
  }
}
