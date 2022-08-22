import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { cartOrder } from '../models/cartOrder';

@Injectable({
  providedIn: 'root'
})
export class CartOrderService {

  constructor(public http: HttpClient) { }
  public CreateCartOrder(cart : cartOrder){
    return this.http.post<cartOrder>(`${environment.apiUrl}CartOrder/CreateCartOrder`, cart);
  }
  public EditCartOrder(id: string, cart : cartOrder){
    return this.http.put<cartOrder>(`${environment.apiUrl}CartOrder/EditCartOrder/${id}`, cart);
  }
  public GetCartOrder(){
    return this.http.get<cartOrder>(`${environment.apiUrl}CartOrder/GetCartOrder`)
  }
  public GetCartOrderById(id: string){
    return this.http.get<cartOrder>(`${environment.apiUrl}CartOrder/GetCartOrderById/${id}`)
  }
}
