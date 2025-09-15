import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notes-files-panel',
  templateUrl: './notes-files-panel.component.html',
  styleUrls: ['./notes-files-panel.component.scss']
})
export class NotesFilesPanelComponent {
  @Input() showPanel: boolean = false;
  @Input() panelTitle: string = '';
  @Output() closePanel = new EventEmitter<void>();
  @Output() saveInput = new EventEmitter<string>();

footerInput: string = '';
onClose() {
  this.showPanel = false;
}

onSave() {
  this.saveInput.emit(this.footerInput);
  this.footerInput = '';
}

}
