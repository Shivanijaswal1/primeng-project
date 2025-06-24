import { Component, ChangeDetectorRef } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ServiceService } from './service/service.service';
import { FormSection } from './component/configuration-based-form/configuration-based-form.component';

interface Column {
  field: string;
  header: string;
}
export interface Product {
  id?: string;
  name?: string;
  quantity?: number;
  category?: string;
  rating?: number;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [ServiceService],
})
export class TabsComponent {
  configData!: FormSection;
  products!: Product[];
  cols!: Column[];
  selectedColumns!: Column[];
  tabs: { title: string; value: number; content: string }[] = [];
  studentDetailFormConfig: any;
  pendingStudentFeesConfig: any;
  activeTabIndex = 2; 

  constructor(
    public config: DynamicDialogConfig,
    private cd: ChangeDetectorRef,
    private _service: ServiceService
  ) {}

  user = { name: '', email: '', age: null, id: null };

  ngOnInit() {
    this.tabs = [
      { title: 'Tab 1', value: 0, content: 'Tab 1 Content' },
      { title: 'Tab 2', value: 1, content: 'Tab 2 Content' },
      { title: 'Tab 3', value: 2, content: 'Tab 3 Content' },
    ];
    let x = this._service.getDummyData();
    x.subscribe((data: any) => {
      this.studentDetailFormConfig = data.studentDetailForm[0];
      this.pendingStudentFeesConfig = data.pendingStudentFees[0];
      this.configData = this.studentDetailFormConfig;
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'rating', header: 'Rating' },
    ];

    this.selectedColumns = [...this.cols];
  }
  get selectedColumn(): Column[] {
    return this.selectedColumns;
  }
  set selectedColumn(val: Column[]) {
    this.selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  onTabChange(event: any) {
   debugger;
    if (event.index === 2) {
      this.configData = this.studentDetailFormConfig;
    } else if (event.index === 3) {
      this.configData = this.pendingStudentFeesConfig;
    }
  }
}
