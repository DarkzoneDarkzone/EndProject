import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { promotion } from '../models/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(public http: HttpClient) { }

  public GetPromotionManage(){
    return this.http.get<promotion>(`${environment.apiUrl}Promotion/GetPromotionForManage`);
  }
  public GetPromotionShow(){
    return this.http.get<promotion>(`${environment.apiUrl}Promotion/GetPromotionForShow`);
  }
  public GetPromotiosById(id: string){
    return this.http.get<promotion>(`${environment.apiUrl}Promotion/GetPromotionById/${id}`);
  }
  public ChangePromotios(id: string){
    return this.http.get<promotion>(`${environment.apiUrl}Promotion/ChangeStatusPromotion/${id}`);
  }
  public CreatePromotion(data: promotion){
    return this.http.post<promotion>(`${environment.apiUrl}Promotion/CreatePromotion`, data);
  }
  public EditPromotion(id: string, data: promotion){
    return this.http.put<promotion>(`${environment.apiUrl}Promotion/EditPromotion/${id}`, data);
  }
}
