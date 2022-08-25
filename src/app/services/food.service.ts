import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { food } from '../models/food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor( public http: HttpClient) { }

  public GetFood(){
    return this.http.get<food>(`${environment.apiUrl}Food/GetFoodAll`);
  }

  public GetFoodById(id: string){
    return this.http.get<food>(`${environment.apiUrl}Food/GetFoodById/${id}`);
  }

  public GetFoodByType(type: string){
    return this.http.get<food>(`${environment.apiUrl}Food/GetFoodByType/${type}`);
  }

  public CreateFood(food: food){
    return this.http.post<food>(`${environment.apiUrl}Food/CreateFood`, food);
  }

  public EditFood(id: string, food: food){
    return this.http.put<food>(`${environment.apiUrl}Food/EditFood/${id}`, food);
  }

  public TotalFood(){
    return this.http.get(`${environment.apiUrl}Food/GetTotalFood`);
  }
}
