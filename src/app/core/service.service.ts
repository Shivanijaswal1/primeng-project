import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormComponent } from '../shared/component/form/form.component';

interface Parent {
  tabId: string;
  feeStatus: string;
  id: number;
  name: string;
  email: string;
  department: string;
  joinedDate: number;
  children: Child[];
}
export enum Role {
  Teacher = 'Teacher',
  Student = 'Student',
  Admin = 'Admin',
  Accounts = 'Accounts'
}
interface Child {
  project: string;
  role: string;
  status: string;
}
export interface BarChartData {
  color: string;
  name: any;
  id?: number;
  label: string;
  value: number;
}
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  currentRole: Role = Role.Student;

  ref: DynamicDialogRef | undefined;
  assignments: any[] = [];
  private _SubmitUrl!: 'http://localhost:3000';
  private chartUrl!: 'http://localhost:3000/data';

  constructor(private http: HttpClient, public dialogservice: DialogService) {}

  addData(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/form', data);
  }

  getStudent(): Observable<Parent[]> {
    return this.http.get<Parent[]>('http://localhost:3000/form');
  }
  delete(id: number | string): Observable<any> {
    return this.http.delete(`http://localhost:3000/form/${id}`);
  }

  deleteMultiple(ids: (number | string)[]): void {
    ids.forEach((id) => {
      this.delete(id).subscribe({
        next: () => console.log(`Deleted ID: ${id}`),
        error: (err) => console.error(`Failed to delete ID ${id}:`, err),
      });
    });
  }
  deleteChildFromParent(parentId: number, childId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/form/${parentId}`).pipe(
      switchMap((parent) => {
        parent.children = (parent.children || []).filter(
          (child: any) => child.id !== childId
        );
        return this.http.put(`http://localhost:3000/form/${parentId}`, parent);
      })
    );
  }

  updateParentWithChildren(
    parentId: string,
    childrenData: any[]
  ): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/form/${parentId}`).pipe(
      switchMap((parent: { children: any[] }) => {
        if (!parent.children) parent.children = [];
        parent.children.push(...childrenData);
        return this.http.put<any>(
          `http://localhost:3000/form/${parentId}`,
          parent
        );
      })
    );
  }

  getDummyData(): Observable<any> {
    const dummyResponse = [
      {
        key: 1,
        value: 'JavaScript',
        children: [
          {
            key: 101,
            value: 'Child 1 of Parent 1',
            details: 'First child of parent 1',
          },
          {
            key: 102,
            value: 'Child 2 of Parent 1',
            details: 'Second child of parent 1',
          },
        ],
      },
      {
        key: 2,
        value: 'JAVA',
        children: [
          {
            key: 201,
            value: 'Child 1 of Parent 2',
            details: 'First child of parent 2',
          },
          {
            key: 202,
            value: 'Child 2 of Parent 2',
            details: 'Second child of parent 2',
          },
        ],
      },
      {
        key: 3,
        value: 'Pyhton',
        children: [
          {
            key: 301,
            value: 'Child 1 of Parent 3',
            details: 'First child of parent 3',
          },
          {
            key: 302,
            value: 'Child 2 of Parent 3',
            details: 'Second child of parent 3',
          },
        ],
      },
    ];

    return of(dummyResponse);
  }

  getDataBarChart(): Observable<BarChartData[]> {
    return this.http.get<BarChartData[]>('http://localhost:3000/data');
  }

  getDataPieChart(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/pieChart');
  }

  getNotifications(): Observable<string[]> {
    return this.http.get<string[]>(`${this._SubmitUrl}/notifications`);
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this._SubmitUrl}/reports`);
  }

  markAttendance(attendance: any): Observable<any> {
    return this.http.post(`${this._SubmitUrl}/attendance`, attendance);
  }
  saveAttendance(data: any[]) {
    return this.http.post(`${this._SubmitUrl}/attendance`, data);
  }
  addAssignment(assignment: any) {
    this.assignments.push(assignment);
    return of(assignment);
  }

  getPerformanceData() {
    const subjects = ['Math', 'Science', 'English', 'History'];
    const data = subjects.map((subject) => {
      const count = this.assignments.filter((a) =>
        a.className.includes(subject)
      ).length;
      return { subject, average: Math.min(100, 80 + count * 5) };
    });
    return of(data);
  }

  private _user$ = new BehaviorSubject<SocialUser | null>(null);
  user$ = this._user$.asObservable();

  set user(user: SocialUser | null) {
    this._user$.next(user);
  }

  get user(): SocialUser | null {
    return this._user$.value;
  }

  show(): void {
    this.ref = this.dialogservice.open(FormComponent, {
      header: 'Student Registration form',
      width: '65%',
      height: 'auto',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      styleClass: 'custom-dialog-header',
    });

    this.ref.onClose.subscribe(() => {
      this.getStudent();
    });
  }
  getFormConfig() {
    return {
      tabs: [
        {
          label: 'Personal Information',
          sectionId: 'personal',
          fields: [
            {
              type: 'input',
              controlName: 'name',
              label: 'Name',
              required: true,
              pattern: '^[A-Za-z]+\\s?[A-Za-z]+$',
              errorMsg: 'Name is required and should contain only letters.',
            },
            {
              type: 'dropdown',
              controlName: 'parent',
              label: 'Choose Parent',
              optionsKey: 'parentOptions',
              optionLabel: 'value',
              optionValue: 'key',
              required: true,
              errorMsg: 'Parent selection is required',
            },
            {
              type: 'dropdown',
              controlName: 'child',
              label: 'Choose Child',
              optionsKey: 'childOptions',
              optionLabel: 'value',
              optionValue: 'key',
              required: true,
              editable: true,
              footerButton: {
                label: 'Add New',
                icon: 'pi pi-plus',
                action: 'DropdownEditable',
              },
              errorMsg: 'Child selection is required',
            },
          ],
        },
        {
          label: 'Contact Details',
          sectionId: 'contact',
          fields: [
            {
              type: 'input',
              controlName: 'email',
              label: 'Email',
              required: true,
              inputType: 'email',
              errorMsg: 'Please enter a valid email address.',
            },
            {
              type: 'input',
              controlName: 'father',
              label: 'Father/Guardian',
              required: true,
              pattern: '^[A-Za-z]+\\s?[A-Za-z]+$',
              errorMsg:
                'Father Name is required and should contain only letters.',
            },
            {
              type: 'input',
              controlName: 'address',
              label: 'Address',
              required: true,
              errorMsg: 'Address is required.',
            },
            {
              type: 'input',
              controlName: 'city',
              label: 'City',
              required: true,
              errorMsg: 'City is required.',
            },
            {
              type: 'input',
              controlName: 'state',
              label: 'State',
              required: true,
              errorMsg: 'State is required.',
            },
            {
              type: 'input',
              controlName: 'postalCode',
              label: 'Postal Code',
              required: true,
              errorMsg: 'Valid postal code is required.',
            },
          ],
        },
        {
          label: 'Additional Information',
          sectionId: 'additional',
          fields: [
            {
              type: 'dropdown',
              controlName: 'selectedValue',
              label: 'Choose Option',
              optionsKey: 'dropdownOptions',
              required: true,
              errorMsg: 'Selection is required',
            },
            {
              type: 'dropdown',
              controlName: 'selectedfees',
              label: 'Fees Processing',
              optionsKey: 'feesprocess',
              required: true,
              errorMsg: 'Selection is required',
            },
            {
              type: 'input',
              controlName: 'age',
              label: 'Age',
              required: true,
              inputType: 'number',
              min: 18,
              max: 100,
              errorMsg: 'Age must be between 18 and 100.',
            },
          ],
        },
      ],
      buttons: [
        {
          type: 'discard',
          label: 'Discard',
          style: 'danger',
          action: 'ResetForm',
        },
        { type: 'submit', label: 'Submit', style: 'primary' },
      ],
    };
  }

   setRole(role: Role) {
    this.currentRole = role;
  }

  isTeacher(): boolean {
    return this.currentRole === Role.Teacher;
  }

  getRole(): string {
    return this.currentRole;
  }
  isStudent(): boolean {
    return this.currentRole === Role.Student;
  }
}
