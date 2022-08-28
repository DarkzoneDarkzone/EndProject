import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  constructor(public callapiorder: OrderService) { }
  tableOrder: any
  currentDate: any = new Date()
  table: any = localStorage.getItem('tableNo')
  ngOnInit(): void {
    this.getOrderTable()
  }
  getOrderTable(){
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
      console.log(data)
    })
  }
}
