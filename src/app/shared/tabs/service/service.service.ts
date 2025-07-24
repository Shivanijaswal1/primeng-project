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
            type: 'calendar',
            field: 'dateofbirth',
            fieldName: 'DOB',
            displayOrder: 2,
            editable: true,
            required: true,
          },
          {
            field: 'project',
            fieldName: 'Project',
            editable: true,
            displayOrder: 1,
            type: 'text',
            required: true,
          },
          {
            field: 'role',
            fieldName: 'Role',
            editable: true,
            displayOrder: 5,
            type: 'text',
            required: true,
          },
          {
            field: 'status',
            options:['True', 'False'],
            fieldName: ' Status',
            editable: true,
            displayOrder: 4,
            type: 'select',
            required: true,
          },
          {
            type: 'calendar',
            field: 'joinDate',
            fieldName: 'Join Date',
            displayOrder: 3,
            editable: true,
            required: true,
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
