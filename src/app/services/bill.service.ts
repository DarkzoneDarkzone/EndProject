import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { bill } from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor( public http : HttpClient ) { }

  public GetBill(){
    return this.http.get<bill>(`${environment.apiUrl}Bill/GetBill`);
  }

  public CreateBill(bill: bill){
    return this.http.post<bill>(`${environment.apiUrl}Bill/CreateBill`, bill);
  }

}
