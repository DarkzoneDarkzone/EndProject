import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-main-employee',
  templateUrl: './main-employee.component.html',
  styleUrls: ['./main-employee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  @ViewChild('closebuttonOrder') closebuttonOrder: any;
  @ViewChild('closebuttonBackOrder') closebuttonBackOrder: any;

  formCreateOrder: any;

  constructor(public fb: FormBuilder, public callapi: OrderService) {
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: null,
      cus_Name: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null
      }],
      status: null,
      creationDatetime: null
    })
   }

  ngOnInit(): void {
  }


  closeModalOrder(){
    this.closebuttonOrder.nativeElement.click();
  }
  closeModalBackOrder(){
    this.closebuttonBackOrder.nativeElement.click();
  }

}
