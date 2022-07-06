import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  @ViewChild('closebuttonShowDetail') closebuttonShowDetail: any;

  formOrderShow: any;
  formOrderShowById: any;
  constructor(
    public fb: UntypedFormBuilder, 
    public callapi: OrderService,
    private spinner: NgxSpinnerService
  ){
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
    // this.spinner.show();
    this.getOrderAll();
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);
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
      this.formOrderShow.reverse();
    })
  }

  getOrderById(id:string){
    this.formOrderShow.find((e: any) => {
      if(e.order_id == id){
        this.formOrderShowById = e
      }
    })
    // this.callapi.GetOrderById(id).subscribe(od => {
    //   this.patchValueFormShow(od);      
    // })
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
      this.getOrderAll()
    });
  }

  closeModalShowDetail(){
    this.closebuttonShowDetail.nativeElement.click();
  }

}
