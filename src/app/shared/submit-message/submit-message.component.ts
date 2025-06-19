import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-submit-message',
  templateUrl: './submit-message.component.html',
  styleUrls: ['./submit-message.component.scss'],
})
export class SubmitMessageComponent {
  constructor(private DynamicDialogRef: DynamicDialogRef) {}
  close(){
    this.DynamicDialogRef.close();
  }
}
