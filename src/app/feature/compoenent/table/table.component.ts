import {Component,ElementRef,HostListener,QueryList,ViewChild,ViewChildren} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ServiceService } from 'src/app/core/service.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FilterService } from 'primeng/api';
import { TableRowCollapseEvent } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TabsComponent } from 'src/app/shared/tabs/tabs.component';
import { AdvanceSortingComponent } from 'src/app/shared/component/advance-sorting/advance-sorting.component';
import { Sidebar } from 'primeng/sidebar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  providers: [DialogService, ConfirmationService, FilterService,DatePipe],
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @ViewChild('filterOverlay') filterOverlay!: OverlayPanel;
  @ViewChildren('headerCell') headerCells!: QueryList<ElementRef>;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  student: any[] = [];
  expandedRows: any = {};
  columns: { field: string; header: string; editable?: boolean }[] = [];
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
  pendingStudent: any[] = [];
  completeStudent: any[] = [];
  activeTabIndex: number = 1;
  selectedStatus: string = 'complete';
  errorTimeout: any;
  tabMenuItems = [
    { label: 'pending ', id: 'pending' },
    { label: 'complete ', id: 'complete' },
    { label: 'All Student ', id: 'all student' },
  ];
  activeTab = this.tabMenuItems[1];
  activeStatus!: 'complete' | 'pending' | 'all student';
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Complete', value: 'complete' },
  ];
  selectedChildIds: number[] = [];
  constructor(
    private _studentService: ServiceService,
    public dialogservice: DialogService,
    private _deleteservice: ConfirmationService,
    private _messageservice: MessageService,
    private datePipe: DatePipe
  ) {}
  selectedParentIdsFromChildren: Set<number> = new Set();
  selectedParentIds: (number | string)[] = [];
selectedChildRecords: { parentId: number, childId: number }[] = [];


  ngOnInit() {
    this.getstudentData();
    this.columns = [
      { field: 'id', header: 'Enrollment No', editable: true },
      { field: 'name', header: 'FullName', editable: false },
      { field: 'email', header: 'Email', editable: true },
      { field: 'age', header: 'Age', editable: false },
      { field: 'selectedValue', header: 'Department', editable: false },
      { field: 'selectedfees', header: 'Fees Status', editable: false },
      { field: 'age', header: 'Amount', editable: true },
      { field: 'id', header: 'second Amount', editable: false },
      { field: 'father', header: 'Fathername', editable: false },
      { field: 'address', header: 'Address', editable: false },
      { field: 'city', header: 'City', editable: false },
      { field: 'state', header: 'State', editable: false },
      { field: 'postalCode', header: 'Postal Code', editable: false },
    ];

    this.dynamicHeaders = [
      { header: 'Project', field: 'Project', sortable: true },
      { header: 'Role', field: 'Role', sortable: true },
      { header: 'Status', field: 'Status', sortable: true },
      { header: 'Join Date', field: 'Join Date', sortable: true },
      { header: 'Date of Birth', filed: 'Date of Birth', sortable: true },
    ];
  }

  isIsoDate(value: unknown): value is string  {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
}

formatDate(value: unknown): string {
  if (this.isIsoDate(value)) {
    return this.datePipe.transform(value, 'dd/MM/yyyy') ?? '';
  }
  return String(value);
}

  getstudentData() {
    this._studentService.getStudent().subscribe((data) => {
      this.student = data;
      this.loading = false;
      this.activeTab = this.tabMenuItems[1];
      this.tabchange('complete');
    });
  }

  onTabChange(event: any) {
    const index = event?.index;
    if (index !== undefined && this.tabMenuItems[index]) {
      const selectedTab = this.tabMenuItems[index];
      this.activeTab = selectedTab;
      this.tabchange(selectedTab.id as 'complete' | 'pending' | 'all student');
    }
  }

  tabchange(status: 'complete' | 'pending' | 'all student') {
    this.pendingStudent = [];
    this.completeStudent = [];
    this.filteredstudent = [];
    this.activeStatus = status;
    if (status === 'all student') {
      this.filteredstudent = [...this.student];
    } else {
      this.filteredstudent = this.student.filter(
        (stu) => (stu.selectedfees || '').toLowerCase() === status.toLowerCase()
      );
    }
    this.pendingStudent = this.student.filter(
      (stu) => (stu.selectedfees || '').toLowerCase() === 'pending'
    );
    this.completeStudent = this.student.filter(
      (stu) => (stu.selectedfees || '').toLowerCase() === 'complete'
    );
  }

  openFilterMenu(event: MouseEvent, field: string) {
    this.selectedField = field;
    this.uniqueValues = [
      ...new Set(this.student.map((student) => student[field])),
    ];
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

  showInvalidError = false;

  checkInvalidCells() {
    const hasInvalid = this.filteredstudent.some((row) =>
      this.columns.some(
        (col) => !row[col.field] && row._clickedField === col.field
      )
    );
    this.showInvalidError = hasInvalid;
    if (hasInvalid) {
      this.showInvalidError = true;
      if (this.errorTimeout) clearTimeout(this.errorTimeout);
      this.errorTimeout = setTimeout(() => {
        this.showInvalidError = false;
      }, 2000);
    } else {
      this.showInvalidError = false;
      if (this.errorTimeout) clearTimeout(this.errorTimeout);
    }
  }

  onCellClick(row: any, field: string) {
    this.filteredstudent.forEach((r) => {
      r._clickedField = null;
    });
    if (!row[field]) {
      row._clickedField = field;
    }
    this.checkInvalidCells();
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
    if (formValue?.policy?.length > 0 && rowData.id) {
      const newChildren = formValue.policy.map((policy: any) => ({
        id: Math.floor(Math.random() * 1000000),
        ...policy,
      }));

      this.loading = true;
      this._studentService.updateParentWithChildren(rowData.id, newChildren).subscribe({
          next: () => {
              this.getstudentData(); 
              this.expandedRows[rowData.id] = true; 
          },
          error: (err) => {
            console.error('Error updating parent:', err);
            this.loading = false;
          },
        });
    }
      this.loading = true;
      setTimeout(() => {
        this.getstudentData();
      }, 2000);
  });
  }

onRowExpand(event: any) {
  const parent = event.data;
  parent.children = parent.children.map((child: any, index: number) => ({
    ...child,
    id: child.id ?? Math.floor(Math.random() * 1000000 + index)
  }));
}

childSelections: { [parentId: number]: any[] } = {};

onChildSelect(parentId: number, event: any) {
  const child = event.data;
  this.selectedChildRecords.push({ parentId, childId: child.id });
}

onChildUnselect(parentId: number, event: any) {
  const child = event.data;
  this.selectedChildRecords = this.selectedChildRecords.filter(
    item => !(item.parentId === parentId && item.childId === child.id)
  );
}

handleChildCheckboxChange(checked: boolean, childId: number, parentId: number){
  if (checked) {
    if (!this.selectedChildIds.includes(childId)) {
      this.selectedChildIds.push(childId);
    }
  } else {
    this.selectedChildIds = this.selectedChildIds.filter(id => id !== childId);
  }
  this.updateSelectedParentsFromChildren();
}


handleCheckboxChange(checked: boolean, parentId: number): void {
  const parent = this.filteredstudent.find(p => p.id === parentId);
  if (checked) {
        this.showDeleteButton = checked;
    if (!this.selectedStudentIds.includes(parentId)) {
      this.selectedStudentIds.push(parentId);
    }
    if (parent?.children?.length) {
      parent.children.forEach((child: { id: number; }) => {
        if (!this.selectedChildIds.includes(child.id)) {
          this.selectedChildIds.push(child.id);
        }
      });
    }
  } else { 
    this.showDeleteButton = checked;
    this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== parentId);
    if (parent?.children?.length) {
      parent.children.forEach((child: { id: number; }) => {
        this.selectedChildIds = this.selectedChildIds.filter(id => id !== child.id);
      });
    }
  }
  this.updateSelectedParentsFromChildren(); 
}

onSelectAllChildChange(checked: boolean, children: any[]) {
  const ids = children.map(c => c.id);
  if (checked) {
    ids.forEach(id => {
      if (!this.selectedChildIds.includes(id)) {
        this.selectedChildIds.push(id);
      }
    });
  } else {
    this.selectedChildIds = this.selectedChildIds.filter(id => !ids.includes(id));
  }
    this.showDeleteButton = checked;
}

areAllChildrenSelected(children: any[]): boolean {
  return children.every(child => this.selectedChildIds.includes(child.id));
}

getSelectedChildrenCount(): number {
  if (this.selectedStudentIds.length > 0) {
    return this.filteredstudent
      .filter(parent => this.selectedStudentIds.includes(parent.id))
      .reduce((count, parent) => {
        const childCount = Array.isArray(parent.children) ? parent.children.length : 0;
        return count + childCount;
      }, 0);
  }
  return this.selectedChildIds.length;
}

getTotalChildCount(): number {
  return this.filteredstudent
    ?.reduce((count, student) => count + (student.children?.length || 0), 0);
}

getSelectedParentsFromChildren(): Set<number> {
  const selectedParents = new Set<number>();
  this.filteredstudent.forEach(parent => {
    if(parent.children?.some((child: { id: number; }) => this.selectedChildIds.includes(child.id))) {
      selectedParents.add(parent.id);
    }
  });
  return selectedParents;
}

getTotalSelectedCount(): number {
  if (this.selectedStudentIds.length > 0) {
    return this.getTotalUniqueParentCount() + this.getSelectedChildrenCount();
  } else {
    return this.selectedChildIds.length;
  }
}

getTotalUniqueParentCount(): number {
  const uniqueParentSet = new Set<number>();
  this.selectedStudentIds.forEach(id => uniqueParentSet.add(id));
  this.filteredstudent.forEach(parent => {
    const childIds = (parent.children || []).map((c: { id: any; }) => c.id);
    const match = this.selectedChildIds.find(id => childIds.includes(id));
    if (match) {
      uniqueParentSet.add(parent.id);
    }
  });
  return uniqueParentSet.size;
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
    this.showDeleteButton = checked;
    this.showDeleteButton = this.selectedStudentIds.length > 0;
  }

updateSelectedParentsFromChildren() {
  const parentSet = new Set<number>();
  for (const student of this.filteredstudent) {
    const selectedChildren = student.children?.filter((c: { id: number; }) => this.selectedChildIds.includes(c.id));
    if (selectedChildren?.length) {
      parentSet.add(student.id);
    }
  }
  this.selectedParentIdsFromChildren = parentSet;
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

  setStatusAndTab(status: 'pending' | 'complete') {
    this.selectedStatus = status;
    if (status === 'pending') {
      this.activeTab = this.tabMenuItems[0];
      this.activeTabIndex = 0;
      this.tabchange('pending');
    } else if (status === 'complete') {
      this.activeTab = this.tabMenuItems[1];
      this.activeTabIndex = 1;
      this.tabchange('complete');
    }
  }
}
