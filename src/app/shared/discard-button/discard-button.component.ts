import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-discard-button',
  templateUrl: './discard-button.component.html',
  styleUrls: ['./discard-button.component.scss']
})
export class DiscardButtonComponent {
  messages: string = '';

  constructor(
    private DynamicDialogRef: DynamicDialogRef,
    public Config: DynamicDialogConfig
  ) {}
  
  close() {
    this.DynamicDialogRef.close();
  }

  ngOnInit() {
    this.messages = this.Config.data.messages;
  }
}  
