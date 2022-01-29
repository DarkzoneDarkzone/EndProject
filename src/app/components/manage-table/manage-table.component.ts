import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { table } from 'src/app/models/table';
import { TableService } from 'src/app/services/table.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-table',
  templateUrl: './manage-table.component.html',
  styleUrls: ['./manage-table.component.css']
})
export class ManageTableComponent implements OnInit {
  @ViewChild('closebuttonCreateTable') closebuttonCreateTable: any;
  formCreateTable:any ;
  formShowTable: any;
  formEditTable: any;

  constructor(public fb: FormBuilder, public callapi: TableService) {
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
    this.getAllTable();
  }

  getAllTable(){
    this.callapi.getTable().subscribe(tb => {
      this.formShowTable = tb;
    })
  }

  // patchValueFormEdit(data: table){
  //   this.formEditTable.patchValue({
  //     table_id: data.table_id,
  //     table_NO: data.table_NO,
  //     status: data.status,
  //     qrcode: data.qrcode
  //   })
  // }

  // getTableByid(id: string){
  //   this.callapi.GetTableById(id).subscribe(tb => {
  //     this.patchValueFormEdit(tb);
  //   })
  // }

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

  closeModalCreateTable() {
    this.closebuttonCreateTable.nativeElement.click();
  }
}
