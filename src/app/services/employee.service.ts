import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor( public http : HttpClient ) { }

  public GetEmployee(){
    return this.http.get<employee>(`${environment.apiUrl}Employee/GetEmployee`);
  }

  public CreateEmployee(employee : employee){
    return this.http.post<employee>(`${environment.apiUrl}Employee/CreateEmployee`, employee);
  }
}
