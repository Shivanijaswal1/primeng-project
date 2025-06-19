import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-z-button',
  templateUrl: './z-button.component.html',
  styleUrls: ['./z-button.component.scss'],
})
export class ZButtonComponent {
  @Input() label: string = '';
  @Output() handleclick = new EventEmitter<void>();
  @Input() class: any;
  @Input() icon: string = '';
  @Input() text: boolean = true;
  @Input() rounded: boolean = true;
  @Input() plain: boolean = true;
  @Input() styleType = 'info';

  onClick() {
    this.handleclick.emit();
  }
    
}

