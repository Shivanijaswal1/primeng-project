import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  
 constructor(private http:HttpClient) { }
  getDummyData(): Observable<any> {
    const studentDetailForm = [
      {
        section: 'studentDetails',
        sectionName: 'Student form detail',
        field: [
           {
            type: 'text',
            field: 'dateofbirth',
            fieldName: 'Date of Birth',
            displayOrder: 4,
            editable: true,
          },
          {
            field: 'project',
            fieldName: 'Project',
            editable: true,
            displayOrder: 1,
            type: 'text',
          },
          {
            field: 'role',
            fieldName: 'Role',
            editable: true,
            displayOrder: 2,
            type: 'text',
          },
          {
            field: 'status',
            options:['true', 'false'],
            fieldName: ' Status',
            editable: true,
            displayOrder: 3,
            type: 'select',
          },
          {
            type: 'text',
            field: 'joinDate',
            fieldName: 'Join Date',
            displayOrder: 4,
            editable: true,
          },
        ],
      },
    ];

    const pendingStudentFees = [
      {
        section: 'studentDetails',
        sectionName: 'Pending Fee Student form',
        field: [
          {
            field: 'firstname',
            fieldName: 'FirstName',
            editable: true,
            displayOrder: 1,
            type: 'text',
          },
          {
            field: 'lastname',
            fieldName: 'LastName',
            editable: true,
            displayOrder: 2,
            type: 'text',
          },
          {
            field: 'enrollmentno',
            fieldName: 'Enrollment No',
            editable: true,                     
            displayOrder: 3,
            type: 'number',
          },
          {
            type: 'select',
            field: 'gender',
            fieldName: 'Gender',
            options: ['Male', 'Female', 'Other'],
            displayOrder: 4,
            editable: true,
          },
        ],
      },
    ];
    return of({ studentDetailForm, pendingStudentFees });
  }
  
getProductsMini(): Promise<any[]> {
  return firstValueFrom(this.http.get<any[]>("http://localhost:3000/product"));
}

}
