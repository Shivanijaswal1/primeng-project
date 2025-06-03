import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';


interface Parent {
  id: number;
  name: string;
  email:string;
  department:string;
  joinedDate:number
  children: Child[];
}

interface Child {
  project:string;
  role:string;
  status:string;
}
export interface BarChartData {
  name: any;
  id?: number;
  label: string;
  value: number;
}
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
 private _SubmitUrl!:"http://localhost:3000/form"
 private chartUrl !:"http://localhost:3000/data"
  constructor(private http:HttpClient) { }

  addData(data:any):Observable <any>{
    return this.http.post("http://localhost:3000/form",data);
  }

  getEmployee(): Observable<Parent[]> {
    return this.http.get<Parent[]>("http://localhost:3000/form");
  }
  delete(id: number | string): Observable<any> {
    return this.http.delete(`http://localhost:3000/form/${id}`);
  }
  
  deleteMultiple(ids: (number | string)[]): void {
    ids.forEach(id => {
      this.delete(id).subscribe({
        next: () => console.log(`Deleted ID: ${id}`),
        error: err => console.error(`Failed to delete ID ${id}:`, err)
      });
    });
}
getDummyData(): Observable<any> {
  const dummyResponse = [
    {
      key: 1,
      value: 'Parent Item 1',
      children: [
        {
          key: 101,
          value: 'Child 1 of Parent 1',
          details: 'First child of parent 1'
        },
        {
          key: 102,
          value: 'Child 2 of Parent 1',
          details: 'Second child of parent 1'
        }
      ]
    },
    {
      key: 2,
      value: 'Parent Item 2',
      children: [
        {
          key: 201,
          value: 'Child 1 of Parent 2',
          details: 'First child of parent 2'
        },
        {
          key: 202,
          value: 'Child 2 of Parent 2',
          details: 'Second child of parent 2'
        }
      ]
    },
    {
      key: 3,
      value: 'Parent Item 3',
      children: [
        {
          key: 301,
          value: 'Child 1 of Parent 3',
          details: 'First child of parent 3'
        },
        {
          key: 302,
          value: 'Child 2 of Parent 3',
          details: 'Second child of parent 3'
        }
      ]
    }
  ];

  return of(dummyResponse);
}

 getDataBarChart(): Observable<BarChartData[]> {
    return this.http.get<BarChartData[]>("http://localhost:3000/data")
  }

 getDataPieChart(): Observable<any>{
  return this.http.get<any>("http://localhost:3000/pieChart")
 }
  

getProductsMini(): Promise<any[]> {
  return firstValueFrom(this.http.get<any[]>("http://localhost:3000/product"));
}

}