import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ServiceService } from 'src/app/core/service.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';
import { SubmitMessageComponent } from '../submit-message/submit-message.component';
import { DiscardButtonComponent } from '../discard-button/discard-button.component';

interface FormPayload {
  name: string;
  email: string;
  age: number;
  selectedValue: string | null;
  father: string;
  seletedfees: string | null;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @ViewChild('dropdownElem') dropdownElem: any;
  @ViewChild('content', { static: false })
  panelSize: number[] = [60, 40];
  minSize: number[] = [50, 10];
  content!: ElementRef;
  form: FormGroup;
  parentOptions: any[] = [];
  childOptions: any[] = [];
  selectedParent: string = '';
  isEditable: boolean = false;
  childExistsError: boolean = false;
  rawPdfUrl: string | null = null;
  submissionTime: string | null = null;
  pdfUrls: any[] = [];
  uploadedFiles: any = [];
  message: string = 'Please Complete all required fields';
  messages: string = 'Are you sure disacrd changes';
  mostRecentType: 'pdf' | 'file' | null = null;
  mostRecentIndex: number = -1;
  activeTab: 'pdf' | 'book' = 'pdf';
  showBookInput: boolean = false;
  bookInputValue: string = '';
  bookValues: string[] = [];
  bookTimes: string[] = [];
  activeTabIndex: number = 0;
  formTabs = [
    { label: 'Personal ', sectionId: 'section-one' },
    { label: 'Contact ', sectionId: 'section-two' },
    { label: 'Additional ', sectionId: 'section-three' },
  ];
  dropdownOptions = [
    { name: 'ART', code: 'O1' },
    { name: 'Medical', code: 'O2' },
    { name: 'Commerce', code: 'O3' },
  ];
  feesprocess = [
    { name: 'Pending', code: 'pending' },
    { name: 'complete', code: 'complete' },
  ];

  constructor(
    public ref: DynamicDialogRef,
    private _service: ServiceService,
    private _mesaage: MessageService,
    private sanitizer: DomSanitizer,
    private dialogservice: DialogService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+\s?[A-Za-z]+$/)]],
      parent: ['', Validators.required],
      child: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      father: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+\s?[A-Za-z]+$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      selectedValue: ['', Validators.required],
      selectedfees: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this._service.getDummyData().subscribe((data) => {
      this.parentOptions = data;
    });
  }

  scrollToSection(sectionId: string, index: number): void {
    this.activeTabIndex = index;
    const section = document.querySelector(`.${sectionId}`);
    section?.scrollIntoView({ behavior: 'smooth' });
  }

  onParentChange(event: any): void {
    const selected = this.parentOptions.find((p) => p.key === event.value);
    if (selected) {
      this.childOptions = selected.children || [];
    } else {
      this.childOptions = [];
    }
    this.form.get('child')?.setValue('');
  }

  handleValueChange(value: any) {
    this.form.get('selectedValue')?.setValue(value);
  }

  handlefeesprocessing(value: any) {
    this.form.get('selectedfees')?.setValue(value);
  }

  onSubmit() {
    const currentTime = new Date();
    this.submissionTime = currentTime.toLocaleString();
    if (this.form.valid) {
      const payload = this.form.value;
      const doc = new jsPDF();
      doc.text(`Name: ${payload.name}`, 10, 10);
      doc.text(`Email: ${payload.email}`, 10, 20);
      doc.text(`Age: ${payload.age}`, 10, 30);
      doc.text(`selectedValue: ${payload.selectedValue.name}`, 10, 40);
      doc.text(`Father's Name: ${payload.father}`, 10, 50);
      doc.text(`Address: ${payload.address}`, 10, 60);
      doc.text(`City: ${payload.city}`, 10, 70);
      doc.text(`State: ${payload.state}`, 10, 80);
      doc.text(`Postal Code: ${payload.postalCode}`, 10, 90);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      this.rawPdfUrl = url;
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.pdfUrls.push({
        url: this.rawPdfUrl,
        name: payload.name,
        submissionTime: this.submissionTime,
      });
      this.updateMostRecentHighlight();
      this._service.addData(payload).subscribe({
        next: (response: any) => {
          this.form.reset();
          this.ref = this.dialogservice.open(SubmitMessageComponent, {
            header: 'Form Submitted Message',
            width: '30%',
            styleClass: 'custom-dialog-header',
            data: { message: 'Form submitted successfully!' },
          });
        },
        error: (error: any) => {
          this._mesaage.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error submitting data',
          });
        },
      });
    } else {
      this.form.markAllAsTouched();
      this.ref = this.dialogservice.open(SubmitMessageComponent, {
        header: 'Error',
        width: '30%',
        styleClass: 'custom-dialog-header',
        data: { message: this.message },
      });
    }
  }

  ResetForm() {
    this.ref = this.dialogservice.open(DiscardButtonComponent, {
      header: 'Discard Form',
      width: '30%',
      styleClass: 'custom-dialog-header',
    });
    this.form.reset();
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.updateMostRecentHighlight();
  }

  updateMostRecentHighlight() {
    let lastPdfTime = this.pdfUrls.length
      ? new Date(this.pdfUrls[this.pdfUrls.length - 1].submissionTime).getTime()
      : 0;
    let lastFileTime = 0;
    if (
      this.uploadedFiles.length &&
      this.uploadedFiles[this.uploadedFiles.length - 1].lastModified
    ) {
      lastFileTime =
        this.uploadedFiles[this.uploadedFiles.length - 1].lastModified;
    }
    if (lastPdfTime === 0 && lastFileTime === 0) {
      this.mostRecentType = null;
      this.mostRecentIndex = -1;
    } else if (lastPdfTime >= lastFileTime) {
      this.mostRecentType = 'pdf';
      this.mostRecentIndex = this.pdfUrls.length - 1;
    } else {
      this.mostRecentType = 'file';
      this.mostRecentIndex = this.uploadedFiles.length - 1;
    }
  }

  DropdownEditable() {
    this.isEditable = true;
    this.form.get('child')?.setValue('');
    const input = this.getInput();
    if (input) {
      input.value = '';
      setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  openPdf(index: number) {
    const pdfBlobUrl = this.pdfUrls[index].url;
    window.open(pdfBlobUrl as string, '_blank');
  }

  onDropdownChange(event: any) {
    const selectedKey = event.value;
    const option = this.childOptions.find((opt) => opt.key === selectedKey);
    if (option) {
      this.form.get('child')?.setValue(selectedKey);
      this.isEditable = false;
      const input = this.getInput();
      if (input) {
        input.value = option.value;
      }
    }
  }

  onDropdownBlur() {
    const input = this.getInput();
    const typedValue = input?.value?.trim();
    if (!typedValue) {
      this.isEditable = false;
      return;
    }
    const existingOption = this.childOptions.find(
      (opt) => opt.value.toLowerCase() === typedValue.toLowerCase()
    );
    if (existingOption) {
      this.form.get('child')?.setValue(existingOption.key);
      input!.value = existingOption.value;
    } else {
      const newKey = Date.now().toString();
      const newOption = { key: newKey, value: typedValue };
      this.childOptions.push(newOption);
      this.form.get('child')?.setValue(newKey);
      input!.value = newOption.value;
    }
    this.isEditable = true;
  }

  private getInput(): HTMLInputElement | null {
    return this.dropdownElem?.el?.nativeElement.querySelector('input') || null;
  }

  setActiveTab(tab: 'pdf' | 'book') {
    this.activeTab = tab;
  }

  saveBookInput() {
    if (this.bookInputValue.trim()) {
      this.bookValues.push(this.bookInputValue.trim());
      this.bookTimes.push(new Date().toLocaleString());
    }

    this.bookInputValue = '';
  }

  cancelBookInput() {
    this.bookInputValue = '';
  }
}
