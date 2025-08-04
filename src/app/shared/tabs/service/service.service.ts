import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type User = {
  id: string | null;
  name: string;
  email: string;
  age: number | null;  
  // city:string | null

};

export type UserField = {
  label: string;
  name: keyof User; // 💡 strongly typed keys from User
  type: string;
  required: boolean;
  min?: number;
  max?: number;
  errorMsg: string;
  
};

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  
 constructor(private http:HttpClient) { }
  getDummyData(): Observable<any> {
    const studentDetailForm = [
      {
        section: 'studentDetails',
        sectionName: 'Student Form Detail',
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
getUserFormFields(): UserField[] {
    return [
      {
        label: 'Enrollment No',
        name: 'id',
        type: 'text',
        required: true,
        errorMsg: 'Enrollment No is required'
      },
      {
        label: 'Full Name',
        name: 'name',
        type: 'text',
        required: true,
        errorMsg: 'Name is required'
      },
      {
        label: 'Email ID',
        name: 'email',
        type: 'email',
        required: true,
        errorMsg: 'Email is required'
      },
      {
        label: 'Age',
        name: 'age',
        type: 'number',
        required: true,
        min: 18,
        max: 100,
        errorMsg: 'Age is required'
      },
    ];
  }

}
