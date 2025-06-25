import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ServiceService } from 'src/app/core/service.service';
import {
  Confirmation,
  ConfirmationService,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { FilterService } from 'primeng/api';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TabsComponent } from 'src/app/shared/tabs/tabs.component';
import { AdvanceSortingComponent } from 'src/app/shared/advance-sorting/advance-sorting.component';

interface ExtendedConfirmation extends Confirmation {
  rejectButtonProps?: {
    label: string;
    severity: string;
    outlined: boolean;
  };
  acceptButtonProps?: {
    label: string;
    severity: string;
  };
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  providers: [DialogService, ConfirmationService, FilterService],
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @ViewChild('filterOverlay') filterOverlay!: OverlayPanel;
  @ViewChildren('headerCell') headerCells!: QueryList<ElementRef>;
  student: any[] = [];
  expandedRows: any = {};
  columns: { field: string; header: string }[] = [];
  globalFields: string[] | undefined;
  globalFilter: string = '';
  ref: DynamicDialogRef | undefined;
  selectedStudentIds: any[] = [];
  dynamicHeaders: any[] = [];
  showDeleteButton: boolean = false;
  isChecked: boolean = false;
  filteredstudent: any[] = [];
  filterMenuItems: MenuItem[] = [];
  selectedField: string = '';
  uniqueValues: string[] = [];
  searchTerm = '';
  searchBarVisible = false;
  selectedValue: string[] = [];
  tempSelectedValue: string[] = [];
  checkboxStates: { [key: string]: boolean } = {};
  matches: number[] = [];
  currentMatchIndex: number = -1;
  activeHighlightedHeader: number | null = null;
  loading: boolean = false;
  currentSortFields: string[] = [];
  sortField: string = '';
  sortOrder: number = 1;
  sortingActive: boolean = false;

  constructor(
    private _studentService: ServiceService,
    public dialogservice: DialogService,
    private _deleteservice: ConfirmationService,
    private _messageservice: MessageService
  ) {}

  ngOnInit() {
    this.getstudentData();
    this.columns = [
      { field: 'id', header: 'Enrollment No' },
      { field: 'name', header: 'FullName' },
      { field: 'email', header: 'Email' },
      { field: 'age', header: 'Age' },
      { field: 'selectedValue', header: 'Department' },
      { field: 'age', header: 'Amount' },
      { field: 'id', header: 'second Amount' },
      { field: 'father', header: 'Fathername' },
      { field: 'address', header: 'Address' },
      { field: 'city', header: 'City' },
      { field: 'state', header: 'State' },
      { field: 'postalCode', header: 'Postal Code' },
    ];

    this.dynamicHeaders = [
      { header: 'Project', field: 'project', sortable: true },
      { header: 'Role', field: 'role', sortable: true },
      { header: 'Status', field: 'status', sortable: true },
      { header: 'Join Date', field: 'joinDate', sortable: true },
      { header: 'Date of Birth', filed: 'dateofbirth', sortable: true },
    ];
  }

  getstudentData() {
    this._studentService.getStudent().subscribe((data) => {
      this.student = data;
      this.loading = false;
      this.filteredstudent = [...this.student];
    });
  }

  openFilterMenu(event: MouseEvent, field: string) {
    this.selectedField = field;
    this.uniqueValues = [...new Set(this.student.map((emp) => emp[field]))];
    this.tempSelectedValue = [...this.selectedValue];
    this.filterOverlay.show(event);
  }

  onCheckboxChange(value: string) {
    if (this.tempSelectedValue.includes(value)) {
      this.tempSelectedValue = this.tempSelectedValue.filter(
        (v) => v !== value
      );
      this.selectedValue = [];
    } else {
      this.tempSelectedValue.push(value);
    }
  }

  advanceSorting() {
    this.ref = this.dialogservice.open(AdvanceSortingComponent, {
      header: 'Advance Sorting',
      width: '40%',
      height: '60vh',
      styleClass: 'custom-dialog-header',
      data: {
        columns: this.columns,
      },
    });
    this.ref.onClose.subscribe((sortData) => {
      if (sortData) {
        this.applyAdvancedSorting(sortData);
      }
    });
  }
  isSorted(field: string): boolean {
    return this.currentSortFields.includes(field);
  }

  applyAdvancedSorting(sortData: { sortField: string; sortOrder: number }[]) {
    this.sortingActive = true;
    this.currentSortFields = sortData.map((s) => s.sortField);
    this.filteredstudent.sort((a, b) => {
      for (const { sortField, sortOrder } of sortData) {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return sortOrder;
        if (valueB == null) return -sortOrder;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          const result = valueA.localeCompare(valueB);
          if (result !== 0) return sortOrder * result;
        } else {
          const result = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          if (result !== 0) return sortOrder * result;
        }
      }
      return 0;
    });
  }

  clearSorting() {
    this.currentSortFields = [];
    this.sortOrder = 0;
    this.sortField = '';
    this.sortingActive = false;
    this.filteredstudent = [...this.student];
  }

  handleNameClick(rowData: any) {
    this.ref = this.dialogservice.open(TabsComponent, {
      data: {
        parentId: rowData.id,
        ...rowData,
      },
      header: `Student Name: ${rowData.name}`,
      width: '40%',
      height: '79vh',
      styleClass: 'custom-dialog-header',
    });
    
    this.ref.onClose.subscribe((formValue) => {
  if (formValue && rowData.id) {
    const childData = {
      project: formValue.project,
      role: formValue.role,
      status: formValue.status,
      joinDate: formValue.joinDate,
      dateofbirth: formValue.dateofbirth
    };

    this._studentService.updateParentWithChild(rowData.id, childData).subscribe({
      next: (updatedParent) => {
        console.log('Parent updated in JSON server:', updatedParent);
        this.getstudentData(); 
      },
      error: (err) => {
        console.error('Error updating parent:', err);
      }
    });
  }
  
 this.loading = true;
    setTimeout(() => {
      this.getstudentData();
    }, 2000);
});
  }


  handleCheckboxRefesh(checked: boolean, id: number) {
    if (checked) {
      if (!this.selectedStudentIds.includes(id)) {
        this.selectedStudentIds.push(id);
      }
    } else {
      this.selectedStudentIds = this.selectedStudentIds.filter(
        (empId) => empId !== id
      );
    }
    this.showDeleteButton = this.selectedStudentIds.length > 0;
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.matches.length > 0) {
      this.nextMatch();
      this.scrollToActiveHeader();
    }
    if (event.key === 'Backspace') {
      this.currentMatchIndex = -1;
      this.activeHighlightedHeader = null;
    }
  }

  onSearchInputChange() {
    const term = this.searchTerm.toLowerCase().trim();
    this.matches = [];
    this.activeHighlightedHeader = null;
    if (!term) return;
    this.columns.forEach((col, idx) => {
      if (col.header.toLowerCase().includes(term)) {
        this.matches.push(idx);
      }
    });
    if (this.matches.length > 0) {
      this.currentMatchIndex = 0;
      this.activeHighlightedHeader = this.matches[0];
    } else {
      this.currentMatchIndex = -1;
      this.activeHighlightedHeader = null;
    }
    this.scrollToActiveHeader();
  }

  nextMatch() {
    if (this.matches.length === 0) return;
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
    this.activeHighlightedHeader = this.matches[this.currentMatchIndex];
    this.searchTerm = this.searchTerm;
    this.scrollToActiveHeader();
  }

  prevMatch() {
    if (this.matches.length === 0) return;
    this.currentMatchIndex =
      (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
    this.activeHighlightedHeader = this.matches[this.currentMatchIndex];
    this.scrollToActiveHeader();
  }

  scrollToActiveHeader() {
    setTimeout(() => {
      this.headerCells.forEach((el) => {
        el.nativeElement.classList.remove('active');
      });
      if (this.activeHighlightedHeader === null) return;
      const headerElement =
        this.headerCells.toArray()[this.activeHighlightedHeader];
      if (headerElement) {
        headerElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        headerElement.nativeElement.classList.add('active');
      }
    }, 0);
  }

  closeSearch() {
    this.searchBarVisible = false;
    this.searchTerm = '';
    this.activeHighlightedHeader = null;
    this.matches = [];
    this.currentMatchIndex = -1;
    this.scrollToActiveHeader();
  }

  applyFilter() {
    this.tempSelectedValue.forEach((val) => {
      if (!this.selectedValue.includes(val)) {
        this.selectedValue.push(val);
      }
    });
    if (this.selectedField && this.selectedValue.length > 0) {
      this.filteredstudent = this.student.filter((emp) =>
        this.selectedValue.includes(emp[this.selectedField])
      );
    }
    this.filterOverlay.hide();
  }

  clearFilter() {
    this.filteredstudent = [...this.student];
    this.selectedValue = [];
    Object.keys(this.checkboxStates).forEach((key) => {
      this.checkboxStates[key] = false;
    });
    this.filterOverlay.hide();
  }

  onGlobalFilter(): void {
    if (this.globalFilter.trim() === '') {
      this.student = [...this.student];
      this.getstudentData();
    } else {
      this.student = this.student.filter((employee) => {
        return Object.values(employee).some((value) =>
          value
            ?.toString()
            .toLowerCase()
            .includes(this.globalFilter.toLowerCase())
        );
      });
    }
  }

  del(arr: any | null) {
    if (arr === null) return;
    const confirmed = this._deleteservice.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this._messageservice.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Student Details Deleted',
          life: 3000,
        });
      },
      reject: () => {
        this._messageservice.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
    if (confirmed) {
      this._studentService.deleteMultiple(this.selectedStudentIds);
      this.getstudentData();
      this.selectedStudentIds = [];
      this.getstudentData();
    }
  }

  handleCheckboxChange(checked: boolean, id: number) {
    if (checked) {
      if (!this.selectedStudentIds.includes(id)) {
        this.selectedStudentIds.push(id);
      }
    } else {
      this.selectedStudentIds = this.selectedStudentIds.filter(
        (empId) => empId !== id
      );
    }
    this.showDeleteButton = checked;
    this.isChecked = this.selectedStudentIds.length === this.student.length;
  }

  onSelectAllChange(checked: boolean): void {
    this.isChecked = checked;
    if (checked) {
      this.selectedStudentIds = this.student.map((emp) => emp.id);
    } else {
      this.selectedStudentIds = [];
    }
    this.showDeleteButton = checked;
  }

  onRowToggle(event: any) {
    console.log('Row toggle event', event);
  }

  onRowExpand(event: TableRowExpandEvent) {
    this._messageservice.add({
      severity: 'info',
      summary: 'Product Expanded',
      detail: event.data.name,
      life: 3000,
    });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this._messageservice.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000,
    });
  }

  confirmDeleteColumn(field: string) {
    this._deleteservice.confirm({
      message: `Are you sure you want to delete the column "${field}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.columns = this.columns.filter((col) => col.field !== field);
        this._messageservice.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Column "${field}" has been deleted`,
          life: 3000,
        });
      },
      reject: () => {
        this._messageservice.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Column deletion cancelled',
          life: 3000,
        });
      },
    });
  }

}
