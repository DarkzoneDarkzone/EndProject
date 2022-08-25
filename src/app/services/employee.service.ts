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

  public EditEmployee(id: string, employee: employee){
    return this.http.put<employee>(`${environment.apiUrl}Employee/EditEmployee/${id}`, employee);
  }

  public GetEmployeeById(id: string){
    return this.http.get<employee>(`${environment.apiUrl}Employee/GetEmpById/${id}`);
  }

  public DeleteEmployee(id: string){
    return this.http.get<employee>(`${environment.apiUrl}Employee/DeleteEmployee/${id}`);
  }

  public CheckLogin(username: string, password: string){
    return this.http.get(`${environment.apiUrl}Employee/CheckLogin/${username}/${password}`);
  }
}
