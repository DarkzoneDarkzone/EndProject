import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { TableService } from 'src/app/services/table.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  @ViewChild('closeModalSelectPay') closeModalSelectPay: any;
  constructor(public callapiorder: OrderService, public callapitable: TableService) {}
  tableOrder: any
  tableByNo: any
  currentDate: any = new Date()
  table: any = localStorage.getItem('tableNo')
  ngOnInit(): void {
    this.getOrderTable()
    this.getTableByNumber()
  }
  getOrderTable(){
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
    })
  }
  getTableByNumber(){
    this.callapitable.getTableByNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableByNo = data
    })
  }
  handlePayment(type: any){
    this.tableOrder.status = type
    this.callapiorder.EditOrder(this.tableOrder.order_id, this.tableOrder).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เรียกพนักงานแล้ว',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.closeModalSelectPays()
        this.getOrderTable()
      })
    })
  }
  closeModalSelectPays(){
    this.closeModalSelectPay.nativeElement.click();
  }
  callService(){
    this.tableByNo.status = "callservice"
    this.callapitable.editTable(this.tableByNo.table_id, this.tableByNo).subscribe(el => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เรียกพนักงานแล้ว',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.getOrderTable()
        this.getTableByNumber()
      })
    })
  }
}
