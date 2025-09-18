import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-notes-files-panel',
  templateUrl: './notes-files-panel.component.html',
  styleUrls: ['./notes-files-panel.component.scss'],
})
export class NotesFilesPanelComponent {
  @Input() rowData: any;
  @Input() showPanel: boolean = false;
  @Input() panelTitle: string = '';
  @Output() saveInput = new EventEmitter<string>();
  @Output() closePanel = new EventEmitter<void>();
  notes: { [id: number]: string } = {};
  footerInput: string = '';

  panelWidth = 420;
  minPanelWidth = 410;
  maxPanelWidth = 600;

  private isResizing = false;
  private startX = 0;
  private startWidth = 0;

  ngOnChanges() {
    if (this.rowData) {
      this.footerInput = this.notes[this.rowData.id] || '';
    }
  }

  onSave() {
    if (this.rowData) {
      this.notes[this.rowData.id] = this.footerInput;
    }
    this.saveInput.emit(this.footerInput);
  }

  onClose() {
    this.closePanel.emit();
  }
  startResize(event: MouseEvent | TouchEvent): void {
    this.isResizing = true;
    this.startX = this.getClientX(event);
    this.startWidth = this.panelWidth;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopResize);
    document.addEventListener('touchmove', this.onMouseMove, {
      passive: false,
    });
    document.addEventListener('touchend', this.stopResize);

    event.preventDefault();
  }

  private onMouseMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.isResizing) return;

    const currentX = this.getClientX(event);
    const delta = currentX - this.startX;
    const newWidth = this.startWidth - delta;

    this.panelWidth = Math.max(
      this.minPanelWidth,
      Math.min(this.maxPanelWidth, newWidth)
    );

    if (event instanceof TouchEvent) event.preventDefault();
  };

  private stopResize = (): void => {
    if (!this.isResizing) return;

    this.isResizing = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopResize);
    document.removeEventListener('touchmove', this.onMouseMove);
    document.removeEventListener('touchend', this.stopResize);
  };

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) return event.clientX;
    if (event.touches && event.touches.length) return event.touches[0].clientX;
    return 0;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.panelWidth = Math.max(
      this.minPanelWidth,
      Math.min(this.maxPanelWidth, this.panelWidth)
    );
  }
}
