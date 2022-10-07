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
  myId: any
  position: any
  queue: number = 1
  constructor(public callapi: OrderService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getOrderAll()]).then((values) => {
      this.spinner.hide();
    });
    this.myId = localStorage.getItem('emp_id')
    this.position = localStorage.getItem('position')
  }

  getOrderAll() {
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
      let countQueue: number = 1
      this.formOrderShow = this.formOrderShow.filter((data: any) => {
        if(data.status == "waitingFood"){
          const foodCurrent = data.foodList.filter((el: any) => {
            if((el.chef_id == '' || el.chef_id == null || el.chef_id == this.myId || el.serve_id == '' || el.serve_id == null || el.serve_id == this.myId) && el.status != "success"){
              el.queue = countQueue++;
              return el
            }
          })
          data.foodList = foodCurrent
          return data
        }
      })
    })
  }

  getOrderById(id: string) {
    this.formOrderShowById = this.formOrderShow.find((e: any) => e.order_id == id)
  }

  changeStatusOrder(id: string, status: string) {
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

  changeStatusFood(order_id: string, food_id: string, status: string) {
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

  receiveFoodOrder(order_id: string, food_id: string) {
    this.callapi.ReceiveFoodOrder(order_id, food_id, localStorage.getItem('emp_id')).subscribe(order => {
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

  sendFoodOrder(order_id: string, food_id: string) {
    this.callapi.SendFoodOrder(order_id, food_id, localStorage.getItem('emp_id')).subscribe(order => {
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

  closeModalShowDetail() {
    this.closebuttonShowDetail2.nativeElement.click();
  }

  counter(i: number) {
    return new Array(i);
  }

  increaseCount(){
    this.queue++
  }
}
