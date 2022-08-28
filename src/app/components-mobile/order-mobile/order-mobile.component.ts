import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-mobile',
  templateUrl: './order-mobile.component.html',
  styleUrls: ['./order-mobile.component.css']
})
export class OrderMobileComponent implements OnInit {
  tableOrder: any
  constructor(public callapiorder: OrderService) { }

  ngOnInit(): void {
    this.getOrderTable()
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
  getOrderTable(){
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
  })
  }
}
