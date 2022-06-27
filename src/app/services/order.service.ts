import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( public http : HttpClient ) { }

  public GetOrder(){
    return this.http.get<order>(`${environment.apiUrl}Order/GetOrder`);
  }

  public GetOrderById(id: string){
    return this.http.get<order>(`${environment.apiUrl}Order/GetOrderById/${id}`);
  }

  public CreateOrder(order : order){
    return this.http.post<order>(`${environment.apiUrl}Order/CreateOrder`, order);
  }

  public ChangeStatusOrder(id: string, status: string){
    return this.http.get<order>(`${environment.apiUrl}Order/ChangeStatusOrder/${id}/${status}`);
  }

  public EditOrder(id: string, order: order){
    return this.http.put<order>(`${environment.apiUrl}Order/EditOrder/${id}`, order);
  }

  public GetBestType(){
    return this.http.get(`${environment.apiUrl}Order/GetBestType`);
  }

  public GetBestFood(){
    return this.http.get(`${environment.apiUrl}Order/GetBestFood`);
  }

  public IncomeMonth(){
    return this.http.get(`${environment.apiUrl}Order/IncomeMonth`);
  }
}
