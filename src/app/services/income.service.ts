import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { income } from '../models/income';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor( public http : HttpClient ) { }

  public GetIncome(){
    return this.http.get<income>(`${environment.apiUrl}Income/GetIncome`);
  }
  public CreateIncome(income : income){
    return this.http.post<income>(`${environment.apiUrl}Income/CreateIncome`,income);
  }
}
