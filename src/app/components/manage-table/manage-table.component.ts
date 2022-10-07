import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { OrderService } from 'src/app/services/order.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { CartOrderService } from 'src/app/services/cart-order.service';
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
  position: any;
  submitCreate: boolean = false;
  pathQRcode: any = window.location.origin + "/mobile?number="

  constructor(
    public fb: UntypedFormBuilder,
    public callapi: TableService,
    public callapiorder: OrderService,
    public callapicart: CartOrderService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ){
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: null,
      number: null,
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
      table_NO: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      status: null,
      qrcode: null
    })
    this.formEditTable = this.fb.group({
      table_id: null,
      table_NO: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      status: null,
      qrcode: null
    })
   }

  ngOnInit(): void {
    this.spinner.show();
    this.position = localStorage.getItem('position')
    Promise.all([this.getAllTable()]).then((values) => {
      this.spinner.hide();
    });
  }

  getAllTable(){
    this.callapi.getTable().subscribe(tb => {
      this.formShowTable = tb;
      this.formShowTable = this.formShowTable.map((e: any) => {
        e.startTime = new Date(e.startTime).toLocaleDateString('th-TH', {
          hour: 'numeric', 
          minute: 'numeric',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        return e
      })
    })
  }

  get formValidCreateTable() {
    return this.formCreateTable.controls;
  }

  createTable(){
    this.formCreateTable.value.status = 'empty';
    this.formCreateTable.value.qrcode = null;
    this.submitCreate = true
    if (this.formCreateTable.valid) {
      this.callapi.createTable(this.formCreateTable.value).toPromise().then(tb => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มโต๊ะสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.formCreateTable.reset()
        this.closeModalCreateTable();
        this.getAllTable();
        this.submitCreate = false
      }).catch((error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          title: 'ไม่สำเร็จ! โปรดลองอีกครั้ง',
          showConfirmButton: false,
          timer: 1000
        })
      })
    }
  }

  generateQrcode(){
    if(this.numberCustomer == 0 || this.numberCustomer == undefined || this.numberCustomer == null){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุจำนวนลูกค้า',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    let formEdit = this.formShowTable.find((el: any) =>  el.table_id == this.currentTableId)
    this.formCreateOrder.value.table_NO = formEdit.table_NO
    this.formCreateOrder.value.number = this.numberCustomer
    this.formCreateOrder.value.status = "waitingFood"
    this.formCreateOrder.value.foodList = []
    this.formCreateOrder.value.creationDatetime = new Date();
    formEdit.qrcode = this.pathQRcode + formEdit.table_NO
    formEdit.status = "befull"
    formEdit.startTime = new Date()
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
        this.numberCustomer = null
        this.closeModalOpenTable()
        this.getAllTable();
      })
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

  handleCancelTable(id: string){
    Swal.fire({
      position: 'top',
      text: "ยืนยันปิดโต๊ะนี้หรือไม่? รายการอาหารที่ลูกค้าโต๊ะนี้สั่งจะสูญหาย",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการปิดโต๊ะ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.currentTable = this.formShowTable.find((el: any) =>  el.table_id == id)
        this.currentTable.status = "empty"
        this.currentTable.startTime = null
        this.callapi.editTable(this.currentTable.table_id, this.currentTable).subscribe(el => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'ปิดโต๊ะสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.callapiorder.DeleteOrder(this.currentTable.table_NO).subscribe(data => {})
            this.callapicart.GetCartOrderByNo(this.currentTable.table_NO).subscribe(data => {
              this.callapicart.DeleteCartOrder(data.cart_id).subscribe(dd => {})
            })
            this.getAllTable();
          })
        })
      }
    })
  }

  handleServiceCustomer(id: any){
    let serviceTable: any = this.formShowTable.find((el: any) =>  el.table_id == id)
    serviceTable.status = 'befull'
    this.callapi.editTable(serviceTable.table_id, serviceTable).subscribe(el => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'ให้บริการแล้ว',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.getAllTable();
      })
    })
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

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
