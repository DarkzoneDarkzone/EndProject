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
  public GetOrderByTableNumber(tableNo: any){
    return this.http.get<order>(`${environment.apiUrl}Order/GetOrderByTableNumber/${tableNo}`);
  }
  public CreateOrder(order : order){
    return this.http.post<order>(`${environment.apiUrl}Order/CreateOrder`, order);
  }
  public ChangeStatusOrder(id: string, status: string){
    return this.http.get<order>(`${environment.apiUrl}Order/ChangeStatusOrder/${id}/${status}`);
  }
  public PaymentOrder(id: string, typePay: string, bank: string){
    return this.http.get<order>(`${environment.apiUrl}Order/PaymentOrder/${id}/${typePay}/${bank}`);
  }
  public ChangeStatusFood(order_id: string, food_id: string, status: string){
    return this.http.get<order>(`${environment.apiUrl}Order/ChangeStatusFood/${order_id}/${food_id}/${status}`);
  }
  public EditOrder(id: string, order: order){
    return this.http.put<order>(`${environment.apiUrl}Order/EditOrder/${id}`, order);
  }
  public DeleteOrder(no: any){
    return this.http.get<order>(`${environment.apiUrl}Order/DeleteOrder/${no}`);
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
