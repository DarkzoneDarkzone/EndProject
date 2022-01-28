import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { table } from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor( public http : HttpClient ) { }

  public getTable(){
    return this.http.get<table>(`${environment.apiUrl}Table/GetTable`);
  }
  public getTableById(id: string){
    return this.http.get<table>(`${environment.apiUrl}Table/GetTableById/${id}`);
  }
  public deleteTables(id: string){
    return this.http.get<table>(`${environment.apiUrl}Table/DeleteTable/${id}`);
  }
  public createTable(table : table){
    return this.http.post<table>(`${environment.apiUrl}Table/CreateTable`, table);
  }
}
