import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { typeFood } from '../models/typefood';

@Injectable({
  providedIn: 'root'
})
export class TypeFoodService {

  constructor( public http: HttpClient) {
  }

  public GetType(){
    return this.http.get<typeFood>(`${environment.apiUrl}TypeFood/GetTypeFood`);
  }

  public CreateType(type: typeFood){
    return this.http.post<typeFood>(`${environment.apiUrl}TypeFood/CreateTypeFood`, type);
  }

  public EditType(id: string, type: typeFood){
    return this.http.put<typeFood>(`${environment.apiUrl}TypeFood/EditTypeFood/${id}`, type);
  }
}

