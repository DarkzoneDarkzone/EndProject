import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { OrderService } from 'src/app/services/order.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.css']
})
export class ManageTableComponent implements OnInit {
  @ViewChild('closebuttonCreateTable') closebuttonCreateTable: any;
  @ViewChild('closebuttonOpenTable') closebuttonOpenTable: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  formCreateTable:any ;
  formShowTable: any;
  formEditTable: any;
  currentTable: any;
  formCreateOrder: any;
  numberCustomer: any;
  currentTableId: any;
  pathQRcode: any = window.location.origin + "/mobile?number="

  constructor(
    public fb: UntypedFormBuilder,
    public callapi: TableService,
    public callapiorder: OrderService,
    private spinner: NgxSpinnerService,
    private router: Router
  ){
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: null,
      number: null,
      typeOrder: null,
      priceTotal: 0,
      foodList: [],
      status: null,
      creationDatetime: null,
      emp_Name: null,
      paytime: null,
      netPrice: 0,
      valuePromotion: 0
    })
    this.formCreateTable = this.fb.group({
      table_id: null,
      table_NO: null,
      status: null,
      qrcode: null
    })
    this.formEditTable = this.fb.group({
      table_id: null,
      table_NO: null,
      status: null,
      qrcode: null
    })
   }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getAllTable()]).then((values) => {
      this.spinner.hide();
    });
  }

  getAllTable(){
    this.callapi.getTable().subscribe(tb => {
      this.formShowTable = tb;
    })
  }

  createTable(){
    this.formCreateTable.value.status = 'empty';
    this.formCreateTable.value.qrcode = null;
    this.callapi.createTable(this.formCreateTable.value).subscribe(tb => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เพิ่มโต๊ะสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closeModalCreateTable();
      this.getAllTable();
    })
  }

  generateQrcode(){
    let formEdit = this.formShowTable.find((el: any) =>  el.table_id == this.currentTableId)
    this.formCreateOrder.value.table_NO = formEdit.table_NO
    this.formCreateOrder.value.number = this.numberCustomer
    this.formCreateOrder.value.status = "waitingFood"
    this.formCreateOrder.value.foodList = []
    Swal.fire({
      position: 'top',
      text: "ยืนยันสร้างคิวอาร์โค้ด",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: 'green',
      confirmButtonText: 'ยืนยัน'
    }).then((result) => {
      if (result.isConfirmed) {
        formEdit.qrcode = this.pathQRcode + formEdit.table_NO
        let today = new Date()
        formEdit.startTime = new Date()
        formEdit.endTime =  new Date(today.setHours(today.getHours() + 1, today.getMinutes() + 30));
        formEdit.status = "befull"
        this.callapi.editTable(this.currentTableId, formEdit).subscribe(el => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'สร้างคิวอาร์โค้ดสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.callapiorder.CreateOrder(this.formCreateOrder.value).subscribe(order => {
              this.formCreateOrder.value = null
            });
            this.closeModalOpenTable()
            this.getAllTable();
          })
        })
      }
    })
  }

  deleteTable(id: string){
      Swal.fire({
        position: 'top',
        text: "ต้องการลบข้อมูลนี้หรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล'
      }).then((result) => {
        if (result.isConfirmed) {
            this.callapi.deleteTables(id).subscribe(tb => {
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'ลบสำเร็จ',
                showConfirmButton: false,
                timer: 1000
              })
              this.getAllTable();
            })
        }
      })
  }

  handleCreateQRcode(id: string){
    this.currentTable = this.formShowTable.find((el: any) =>  el.table_id == id)
  }

  selectTable(id: string){
    this.currentTableId = id
  }

  closeModalCreateTable() {
    this.closebuttonCreateTable.nativeElement.click();
  }
  closeModalOpenTable() {
    this.closebuttonOpenTable.nativeElement.click();
  }
}
