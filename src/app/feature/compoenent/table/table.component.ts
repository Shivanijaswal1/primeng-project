import { AdvanceSortingComponent } from 'src/app/shared/component/advance-sorting/advance-sorting.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FilterService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ServiceService } from 'src/app/core/service.service';
import { Sidebar } from 'primeng/sidebar';
import { TableRowCollapseEvent } from 'primeng/table';
import { TabsComponent } from 'src/app/shared/tabs/tabs.component';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

interface Course {
  status: string;
  sequence: number;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  providers: [DialogService, ConfirmationService, FilterService, DatePipe],
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
   notes: { [rowId: number]: string[] } = {};
  files: { [rowId: number]: string[] } = {};
  @ViewChild('filterOverlay') filterOverlay!: OverlayPanel;
  @ViewChildren('headerCell') headerCells!: QueryList<ElementRef>;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @ViewChild('nameMenu') nameMenu: any;
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
  nameMenuItems: MenuItem[] = [];
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
  highlightedColumn: string | null = null;
  tabMenuItems = [
    { label: 'Pending', id: 'pending' },
    { label: 'Complete', id: 'complete' },
    { label: 'All Students', id: 'all' },
  ];
  activeTab = this.tabMenuItems[1];
  activeStatus!: 'complete' | 'pending' | 'all';
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Complete', value: 'complete' },
  ];
  selectedChildIds: number[] = [];
  showPanel: boolean = false;
  panelTitle: string = '';
  openRowId: number | null = null;
   selectedRow: any = null;
   activeIcon: { [rowId: number]: 'files' | 'notes' | null } = {};
  constructor(
    private _studentService: ServiceService,
    public dialogservice: DialogService,
    private _deleteservice: ConfirmationService,
    private _messageservice: MessageService,
    private datePipe: DatePipe
  ) {}
  selectedParentIdsFromChildren: Set<number> = new Set();
  selectedParentIds: (number | string)[] = [];
  selectedChildRecords: { parentId: number; childId: number }[] = [];
  data: any;

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
      { header: 'Date of Birth', field: 'Date of Birth', sortable: true },
    ];
  }
onPanelSave(content: string) {
    if (!this.selectedRow || !content.trim()) return;

    const rowId = this.selectedRow.id;

    if (this.panelTitle === 'Notes') {
      if (!this.notes[rowId]) this.notes[rowId] = [];
      this.notes[rowId].push(content.trim());
    } else if (this.panelTitle === 'Files') {
      if (!this.files[rowId]) this.files[rowId] = [];
      this.files[rowId].push(content.trim());
    }
  }


  openNotesPanel(row: any) {
      this.resetAllIcons();
    if (this.openRowId === row.id && this.showPanel) {

      this.closePanel();
    } else {
      this.panelTitle = 'Notes';
      this.selectedRow = row;
      this.showPanel = true;
      this.openRowId = row.id;
    this.activeIcon[row.id] = 'notes';
    }
  }

  openFilesPanel(row: any) {
      this.resetAllIcons();
    if (this.openRowId === row.id && this.showPanel && this.panelTitle === 'Files') {
      this.closePanel();
    } else {
      this.panelTitle = 'Files';
      this.selectedRow = row;
      this.showPanel = true;
      this.openRowId = row.id;
     this.activeIcon[row.id] = 'files';
    }
  }

  closePanel(rowId?: number) {
    this.showPanel = false;
    this.openRowId = null;
    this.selectedRow = null;
    this.panelTitle = '';
  if (rowId) {
    this.activeIcon[rowId] = null;
  }
  }
  resetAllIcons() {
  Object.keys(this.activeIcon).forEach(key => {
    this.activeIcon[+key] = null;
  });
}

  isDate(value: unknown): value is string {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
  }

  getstudentData() {
    this._studentService.getStudent().subscribe((data) => {
      const patchedData = (data || []).map((stu: any) => ({
        ...stu,
        file: stu.file ?? '',
        note: stu.note ?? '',
      }));
      this.student = patchedData;
      this.filteredstudent = [...patchedData];
      this.loading = false;
      this.activeTab = this.tabMenuItems[1];
      this.tabchange('complete');
    });
  }

  openNameMenu(event: Event, rowData: any) {
    this.nameMenuItems = [
      {
        label: 'VOB',
        icon: 'pi pi-file',
        command: () => this.getFormData(),
      },
      {
        label: 'Student Detail',
        icon: 'pi pi-user',
        command: () => this.handleChildNameClick(event, rowData),
      },
    ];
    this.nameMenu.toggle(event);
  }

  getFormData(): void {
    this._studentService.show();
  }

  handleChildNameClick(event: any, rowData: any) {
    this.ref = this.dialogservice.open(TabsComponent, {
      data: {
        parentId: rowData.id,
        ...rowData,
        parentData: rowData,
      },
      header: `Child Name: ${rowData.name}`,
      width: '40%',
      height: '79vh',
      styleClass: 'custom-dialog-header',
    });
    this.ref.onClose.subscribe((formValue: any) => {
      if (formValue?.policy?.length > 0 && rowData.id) {
        const updatedPolicy = formValue.policy[0];
        const parentIndex = this.student.findIndex(
          (student) => student.id === rowData.id
        );
        if (parentIndex !== -1) {
          const parentObj = this.student[parentIndex];
          this.loading = true;
          this._studentService
            .updateParentWithChildren(rowData.id, parentObj.children)
            .subscribe({
              next: () => {
                this.loading = false;
              },
              error: (err: any) => {
                this.loading = false;
              },
            });
        }
      }
    });
  }

  tabchange(status: string) {
    const normalized = status.toLowerCase().trim();
    if (normalized === 'all') {
      this.filteredstudent = [...this.student];
    } else {
      this.filteredstudent = this.student.filter((stu) => {
        const feeCode = (stu.selectedfees?.code ?? '')
          .toString()
          .toLowerCase()
          .trim();
        return feeCode === normalized;
      });
    }
  }

  onTabChange(event: any) {
    const index = event?.index;
    if (index !== undefined && this.tabMenuItems[index]) {
      this.tabchange(this.tabMenuItems[index].id);
    }
  }

  formatValue(value: any, fieldName?: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      if (value.name) return value.name;
      if (value.label) return value.label;
      if (Array.isArray(value)) {
        return value.map((v) => this.formatValue(v)).join(', ');
      }
      return JSON.stringify(value);
    }
    return value.toString();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  openFilterMenu(event: MouseEvent, field: string) {
    this.selectedField = field;
    this.uniqueValues = [
      ...new Set(
        this.student.map((student) => this.formatValue(student[field]))
      ),
    ];
    this.tempSelectedValue = [...this.selectedValue];
    this.filterOverlay.show(event);
  }

  applyFilter() {
    this.tempSelectedValue.forEach((val) => {
      if (!this.selectedValue.includes(val)) {
        this.selectedValue.push(val);
      }
    });

    if (this.selectedField && this.selectedValue.length > 0) {
      const field = this.selectedField;
      this.filteredstudent = this.student.filter((student) => {
        const formatted = this.formatValue(student[field]);

        return this.selectedValue.includes(formatted);
      });
    }
    this.filterOverlay.hide();
  }
  clearFilter() {
    this.filteredstudent = [...this.student];
    this.selectedValue = [];
    this.tempSelectedValue = [];
    Object.keys(this.checkboxStates).forEach((key) => {
      this.checkboxStates[key] = false;
    });
    this.filterOverlay.hide();
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
        (col) =>
          (row[col.field] === null ||
            row[col.field] === undefined ||
            row[col.field] === '') &&
          row._clickedField === col.field
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
    if (row[field] === null || row[field] === undefined || row[field] === '') {
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

  parentcolumns: { field: string; header?: string }[] = [];

  isSorted(field: string): boolean {
    if (!this.currentSortFields?.length) return false;
    const result = this.currentSortFields.some(
      (f) => f.toLowerCase().trim() === field.toLowerCase().trim()
    );
    if (result) {
      console.log('Highlighting column:', field);
    }
    return result;
  }

  applyAdvancedSorting(sortData: { sortField: string; sortOrder: number }[]) {
    this.sortingActive = true;
    this.currentSortFields = sortData.map((s) =>
      s.sortField.trim().toLowerCase()
    );
    this.filteredstudent.sort((a, b) => {
      for (const { sortField, sortOrder } of sortData) {
        let valueA = this.resolveField(a, sortField);
        let valueB = this.resolveField(b, sortField);
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

  private resolveField(obj: any, field: string) {
    return field.split('.').reduce((o, key) => (o ? o[key] : null), obj);
  }

  clearSorting() {
    this.currentSortFields = [];
    this.sortOrder = 0;
    this.sortField = '';
    this.sortingActive = false;
    this.filteredstudent = [...this.student];
  }

  onRowExpand(event: any) {
    const parent = event.data;
    if (Array.isArray(parent.children)) {
      parent.children = parent.children.map((child: any, index: number) => ({
        ...child,
        id: child['id'] ?? Math.floor(Math.random() * 1000000 + index),
      }));
    }
  }

  childSelections: { [parentId: number]: any[] } = {};

  handleChildCheckboxChange(
    checked: boolean,
    childId: number,
    parentId: number
  ) {
    if (checked) {
      if (!this.selectedChildIds.includes(childId)) {
        this.selectedChildIds.push(childId);
      }
    } else {
      this.selectedChildIds = this.selectedChildIds.filter(
        (id) => id !== childId
      );
    }
    this.updateSelectedParentsFromChildren();
  }

  handleCheckboxChange(checked: boolean, parentId: number): void {
    const parent = this.filteredstudent.find((p) => p.id === parentId);
    if (checked) {
      this.showDeleteButton = checked;
      if (!this.selectedStudentIds.includes(parentId)) {
        this.selectedStudentIds.push(parentId);
      }
      if (parent?.children?.length) {
        parent.children.forEach((child: { id: number }) => {
          if (!this.selectedChildIds.includes(child.id)) {
            this.selectedChildIds.push(child.id);
          }
        });
      }
    } else {
      this.showDeleteButton = checked;
      this.selectedStudentIds = this.selectedStudentIds.filter(
        (id) => id !== parentId
      );
      if (parent?.children?.length) {
        parent.children.forEach((child: { id: number }) => {
          this.selectedChildIds = this.selectedChildIds.filter(
            (id) => id !== child.id
          );
        });
      }
    }
    this.updateSelectedParentsFromChildren();
  }
  getSelectedChildrenCount(): number {
    if (this.selectedStudentIds.length > 0) {
      return this.filteredstudent
        .filter((parent) => this.selectedStudentIds.includes(parent.id))
        .reduce((count, parent) => {
          const childCount = Array.isArray(parent.children)
            ? parent.children.length
            : 0;
          return count + childCount;
        }, 0);
    }
    return this.selectedChildIds.length;
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
    this.selectedStudentIds.forEach((id) => uniqueParentSet.add(id));
    this.filteredstudent.forEach((parent) => {
      const childIds = (parent.children || []).map((c: { id: any }) => c.id);
      const match = this.selectedChildIds.find((id) => childIds.includes(id));
      if (match) {
        uniqueParentSet.add(parent.id);
      }
    });
    return uniqueParentSet.size;
  }

  updateSelectedParentsFromChildren() {
    const parentSet = new Set<number>();
    for (const student of this.filteredstudent) {
      const selectedChildren = student.children?.filter((c: { id: number }) =>
        this.selectedChildIds.includes(c.id)
      );
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

  onGlobalFilter(): void {
    if (this.globalFilter.trim() === '') {
      this.filteredstudent = [...this.student];
    } else {
      const filterValue = this.globalFilter.toLowerCase();
      this.filteredstudent = this.student.filter((employee) =>
        this.flattenObject(employee).includes(filterValue)
      );
    }
  }
  private flattenObject(obj: any, seen: Set<any> = new Set()): string {
    if (obj === null || obj === undefined) return '';
    if (typeof obj !== 'object') return obj.toString().toLowerCase();
    if (seen.has(obj)) return '';
    seen.add(obj);
    if (Array.isArray(obj)) {
      return obj.map((item) => this.flattenObject(item, seen)).join(' ');
    }
    return Object.values(obj)
      .map((value) => this.flattenObject(value, seen))
      .join(' ');
  }

  del(arr: any | null) {
    if (arr === null) return;
    this._deleteservice.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this._studentService.deleteMultiple(this.selectedStudentIds);
        this.getstudentData();
        this.selectedStudentIds = [];
        this.getstudentData();
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
  }

  onSelectAllChange(checked: boolean): void {
    this.isChecked = checked;
    if (checked) {
      this.selectedStudentIds = this.student.map((student) => student.id);
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
          life: 3000
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
  shouldShowActionBar(): boolean {
    const parentCount = this.getTotalUniqueParentCount();
    const childCount = this.getSelectedChildrenCount();
    const totalCount = this.getTotalSelectedCount();
    return parentCount > 0 || childCount > 0 || totalCount > 0;
  }

  onStatusChange(event: any) {
    const selectedStatus = event.value;
    this.selectedStatus = selectedStatus;
    if (selectedStatus === 'pending') {
      this.filteredstudent = this.student.filter((stu) => {
        const feeCode = (stu.selectedfees?.code ?? '')
          .toString()
          .toLowerCase()
          .trim();
        return feeCode === 'pending';
      });
      this.activeTabIndex = 0;
    } else if (selectedStatus === 'complete') {
      this.filteredstudent = this.student.filter((stu) => {
        const feeCode = (stu.selectedfees?.code ?? '')
          .toString()
          .toLowerCase()
          .trim();
        return feeCode === 'complete';
      });
      this.activeTabIndex = 1;
    }

    this.selectedStudentIds = [];
    this.selectedChildIds = [];
    this.showDeleteButton = false;
    this.isChecked = false;
  }
}
