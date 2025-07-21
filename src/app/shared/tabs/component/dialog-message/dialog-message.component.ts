import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.scss'],
})
export class DialogMessageComponent {
  message: string = '';
  constructor(
    private DynamicDialogRef: DynamicDialogRef,
    public Config: DynamicDialogConfig
  ) {}

  close() {
    this.DynamicDialogRef.close();
  }

  ngOnInit() {
    this.message = this.Config.data.message;
  }
  
}
