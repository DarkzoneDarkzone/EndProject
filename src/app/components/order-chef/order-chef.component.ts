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
  @ViewChild('closebuttonShowDetail2') closebuttonShowDetail2: any;
  formOrderShow: any;
  formOrderShowById: any;
  constructor(public callapi: OrderService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getOrderAll()]).then((values) => {
      this.spinner.hide();
    });
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
      this.formOrderShow = this.formOrderShow.filter((data: any) => data.status == "waitingFood")
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

  changeStatusFood(order_id: string, food_id: string, status: string){
    this.callapi.ChangeStatusFood(order_id, food_id, status).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.getOrderAll()
      this.closeModalShowDetail()
    })
  }

  closeModalShowDetail(){
    this.closebuttonShowDetail2.nativeElement.click();
  }
}
