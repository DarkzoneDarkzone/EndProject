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
}
