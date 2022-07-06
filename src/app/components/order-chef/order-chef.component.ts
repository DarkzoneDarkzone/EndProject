import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-order-chef',
  templateUrl: './order-chef.component.html',
  styleUrls: ['./order-chef.component.css']
})
export class OrderChefComponent implements OnInit {
  @ViewChild('closebuttonShowDetail') closebuttonShowDetail: any;
  formOrderShow: any;
  formOrderShowById: any;
    constructor(public callapi: OrderService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.getOrderAll();
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
    })
  }

  getOrderById(id:string){
    this.formOrderShowById = this.formOrderShow.find((e: any) => e.order_id == id)
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
