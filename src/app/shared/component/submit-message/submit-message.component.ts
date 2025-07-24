import { Component, Input } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-submit-message',
  templateUrl: './submit-message.component.html',
  styleUrls: ['./submit-message.component.scss'],
})
export class SubmitMessageComponent {
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
