import { ChangeDetectorRef, Component } from '@angular/core';
import { ServiceService } from 'src/app/core/service.service';

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
  selector: 'app-student-detail-table',
  templateUrl: './student-detail-table.component.html',
  styleUrls: ['./student-detail-table.component.scss'],
})
export class StudentDetailTableComponent {
  products!: Product[];
  cols!: Column[];
  selectedColumns!: Column[];
  tabs: { title: string; value: number; content: string }[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private _service: ServiceService
  ) {}

  ngOnInit() {
    this.tabs = [
      { title: 'Tab 1', value: 0, content: 'Tab 1 Content' },
      { title: 'Tab 2', value: 1, content: 'Tab 2 Content' },
      { title: 'Tab 3', value: 2, content: 'Tab 3 Content' },
    ];

    this._service.getProductsMini().then((data) => {
      this.products = data;
      this.cd.markForCheck();
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
}
