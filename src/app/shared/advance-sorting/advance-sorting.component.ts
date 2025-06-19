import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-advance-sorting',
  templateUrl: './advance-sorting.component.html',
  styleUrls: ['./advance-sorting.component.scss'],
})
export class AdvanceSortingComponent {
  columns: any[] = [];
  sortFields: { field: string; order: string }[] = [];
  selectedItem: string = '';
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.columns = this.config.data.columns;
    this.sortFields = [{ field: '', order: 'asc' }];
  }

  addSortField() {
    this.sortFields.push({ field: '', order: 'asc' });
  }

  applySort() {
    const selectedFields = this.sortFields
      .filter((field) => field.field)
      .map((field) => ({
        sortField: field.field,
        sortOrder: field.order === 'asc' ? 1 : -1,
      }));
    if (selectedFields.length > 0) {
      this.ref.close(selectedFields);
    }
  }
}
