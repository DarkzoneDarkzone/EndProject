import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  formOrderShow: any;
  formOrderShowById: any;
  constructor(public fb: FormBuilder, public callapi: OrderService) {
    this.formOrderShowById = this.fb.group({
      order_id: null,
      table_NO: null,
      typeOrder: null,
      number: null,
      priceTotal: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null,
        imgPath: null,
        status: null,
        amount: 0
      }],
      status: null,
      creationDatetime: null
    })
   }

  ngOnInit(): void {
    this.getOrderAll();
  }

  patchValueFormShow(data: order){
    this.formOrderShowById.patchValue({
      order_id : data.order_id,
      table_NO : data.table_NO,
      typeOrder : data.typeOrder,
      number: data.number,
      priceTotal: data.priceTotal,
      foodList : data.foodList,
      status : data.status,
      creationDateTime : data.creationDatetime
    })
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
    })
  }

  getOrderById(id:string){
    this.callapi.GetOrderById(id).subscribe(od => {
      this.patchValueFormShow(od);      
    })
  }

  changeStatusOrder(id: string,status: string){
    this.callapi.ChangeStatusOrder(id, status).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
    });
  }
}
