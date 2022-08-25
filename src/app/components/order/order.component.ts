import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  @ViewChild('closebuttonShowDetail1') closebuttonShowDetail1: any;
  
  formOrderShow: any;
  formOrderShowById: any;
  constructor(
    public fb: UntypedFormBuilder, 
    public callapi: OrderService,
    private spinner: NgxSpinnerService,
    public callapitable: TableService,
  ){}

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getOrderAll()]).then((values) => {
      this.spinner.hide();
    });
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
      this.formOrderShow = this.formOrderShow.filter((data: any) => data.status != "success")
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
    this.closebuttonShowDetail1.nativeElement.click();
  }
}
