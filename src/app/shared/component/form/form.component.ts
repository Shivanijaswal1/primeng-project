import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ServiceService } from 'src/app/core/service.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { jsPDF } from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';
import { SubmitMessageComponent } from '../submit-message/submit-message.component';
import autoTable from 'jspdf-autotable';
import { DiscardButtonComponent } from '../discard-button/discard-button.component';
import { AutoComplete } from 'primeng/autocomplete';
import { MultiSelect } from 'primeng/multiselect';

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
  // @ViewChild('content', { static: false })
    @ViewChild('parentAutoComplete') parentAutoComplete!: AutoComplete;
      @ViewChild('parentMultiSelect') parentMultiSelect!: MultiSelect;
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
      name: [ '', [Validators.required, Validators.pattern(/^[A-Za-z]+\s?[A-Za-z]+$/)],],
      parent: ['', Validators.required],
      child: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      father: [ '', [Validators.required, Validators.pattern(/^[A-Za-z]+\s?[A-Za-z]+$/)],],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      selectedValue: ['', Validators.required],
      selectedfees: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)],],
    });
  }

  ngOnInit(): void {
    this._service.getDummyData().subscribe((data) => {
      this.parentOptions = data;
    });
      this._service.getDummyData().subscribe((data) => {
    this.parentOptions = data;
    this.openParentSuggestions();
  });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.parentMultiSelect.show();
    }, );
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
  this.submissionTime = this.formatDate(currentTime);
  if (this.form.valid) {
    const payload = this.form.value;
    const selectedValueName = payload.selectedValue?.name || '';
    const selectedFeesName = payload.selectedfees?.name || '';
    const doc = new jsPDF();
    doc.setFillColor(40, 78, 120);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Form Submission Receipt', 105, 16, { align: 'center' });

    const tableData = [
      ['Name', payload.name],
      ['Email', payload.email],
      ['Age', payload.age.toString()],
      ['Selected Value', selectedValueName],
      ['Father\'s Name', payload.father],
      ['Address', payload.address],
      ['City', payload.city],
      ['State', payload.state],
      ['Postal Code', payload.postalCode],
      ['Fees Status', selectedFeesName],
      ['Submitted On', this.submissionTime],
    ];

    autoTable(doc, {
      head: [['Field', 'Value']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [40, 78, 120], textColor: 255, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Generated by MyApp © 2025', 105, 290, { align: 'center' });

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
      next: () => {
        // this.form.reset();
        this.ref = this.dialogservice.open(SubmitMessageComponent, {
          header: 'Form Submitted Message',
          width: '30%',
          styleClass: 'custom-dialog-header',
          data: { message: 'Form submitted successfully!' },
        });
      },
      error: () => {
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
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
  filteredParents: any[] = [];

  openParentSuggestions() {
  this.filteredParents = [...this.parentOptions];
  setTimeout(() => {
    if (this.parentAutoComplete) {
      this.parentAutoComplete.show();
    }
  });
}
onParentSelect(event: any) {
  this.childOptions = event?.children || [];
  this.form.get('child')?.reset();
}

filterParents(event: any) {
  const query = event.query.toLowerCase();
  this.filteredParents = this.parentOptions.filter(p =>
    p.value.toLowerCase().includes(query)
  );
}

}
