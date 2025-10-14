import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ServiceService } from 'src/app/core/service/service.service';
@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.scss'],
})
export class ShowDataComponent {
  name: string = '';
  email: string = '';
  age: number | null = null;

  payload: {} | undefined;
  formData: any = {};
  @Input() data: any;
  @Output() formSubmit = new EventEmitter<any>();
  user = { name: '', email: '', age: null, id: null };

  constructor(
    public config: DynamicDialogConfig,
    private _mesaage: MessageService,
    private _service: ServiceService,
    public ref: DynamicDialogRef
  ) {}
  ngOnInit() {
    if (this.config.data) {
      this.user = { ...this.config.data };
    }
  }
  closeDialog() {
    this.ref.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.payload = {
        name: this.name,
        email: this.email,
        age: this.age,
      };

      this._service.addData(this.payload).subscribe({
        next: (response: any) => {
          this.formData = {};
          console.log('Data submitted successfully', response);
          this._mesaage.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Message Content',
          });
          form.reset();
          this.ref.close();
        },
        error: (error: any) => {
          console.error('Error submitting data', error);
        },
      });
    } else {
      form.control.markAllAsTouched();
      console.log('Form is invalid');
      this._mesaage.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Message Content',
      });
    }
  }
}
