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

  @ViewChild('closebuttonShowDetail3') closebuttonShowDetail3: any;
  @ViewChild('closebuttonShowModalPayment') closebuttonShowModalPayment: any;

  formOrderShow: any;
  formOrderAll: any;
  formOrderShowById: any;
  bankSelected: any = null;
  current_order: any;
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
    this.spinner.show();
    Promise.all([this.getOrderAll()]).then((values) => {
      this.spinner.hide();
    });
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
      this.formOrderAll = od
      this.formOrderAll.reverse();
      this.formOrderShow = this.formOrderAll
    })
  }

  getOrderById(id:string){
    this.formOrderAll.find((e: any) => {
      if(e.order_id == id){
        this.formOrderShowById = e
      }
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
      this.getOrderAll()
    });
  }

  confirmPayment(){
    return false
    Swal.fire({
      position: 'top',
      text: "ยืนยันการชำระเงินโต๊ะนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน'
    }).then((result) => {
      if(result.isConfirmed){
        this.callapi.PaymentOrder(this.current_order.order_id, this.current_order.status, this.bankSelected).subscribe(order => {
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
    })
  }

  selectOrder(id: string){
    this.current_order = this.formOrderAll.find((el: any) => el.order_id == id)
    console.log(this.current_order)
  }

  closeModalShowDetail(){
    this.closebuttonShowDetail3.nativeElement.click();
  }

  closebuttonModalPayment(){
    this.closebuttonShowModalPayment.nativeElement.click();
  }

  filterStatus(status: string){
    if(status == ''){
      this.formOrderShow = this.formOrderAll
    } else if(status == 'waitingPayment'){
      this.formOrderShow = this.formOrderAll.filter((data: any) => data.status == 'payOnsite' || data.status == 'payOnline')
    } else {
      this.formOrderShow = this.formOrderAll.filter((data: any) => data.status == status)
    }
  }

}
