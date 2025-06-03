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
    const section = [
      {
        section: 'studentDetails',
        sectionName: 'Student form detail',
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
    return of(section);
  }
  
getProductsMini(): Promise<any[]> {
  return firstValueFrom(this.http.get<any[]>("http://localhost:3000/product"));
}

}
