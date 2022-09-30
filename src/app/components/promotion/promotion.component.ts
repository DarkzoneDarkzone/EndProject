import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { promotion } from 'src/app/models/promotion';
import { PromotionService } from 'src/app/services/promotion.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  @ViewChild('closebuttonCreatePromotion') closebuttonCreatePromotion: any;
  @ViewChild('closebuttonEditPromotion') closebuttonEditPromotion: any;
  formCreatePromotion: any;
  formShowPromotion: any;
  formEditPromotion: any;

  constructor(
    public callapiPro: PromotionService, 
    public fb: UntypedFormBuilder,
    private spinner: NgxSpinnerService
  ){
      this.formCreatePromotion = this.fb.group({
        promotion_id: null,
        promotion_name: null,
        status: null,
        detail: null,
        value: null,
        type: null
      })
      this.formEditPromotion = this.fb.group({
        promotion_id: null,
        promotion_name: null,
        status: null,
        detail: null,
        value: null,
        type: null
      })
   }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getPromotionManage()]).then((values) => {
      this.spinner.hide();
    });
  }

  getPromotionManage(){
    this.callapiPro.GetPromotionManage().subscribe(pro => {
      this.formShowPromotion = pro;
    })
  }

  patchValueFormEdit(data: promotion){
    this.formEditPromotion.patchValue({
      promotion_id: data.promotion_id,
      promotion_name: data.promotion_name,
      status: data.status,
      detail: data.detail,
      value: data.value,
      type: data.type
    })
  }

  getPromotionById(id: string){
    this.callapiPro.GetPromotionById(id).subscribe(pro => {
      this.patchValueFormEdit(pro);
    })
  }

  createPromotion(){
    this.formCreatePromotion.value.status = false;
    this.formCreatePromotion.value.value = parseInt(this.formCreatePromotion.value.value);
    this.callapiPro.CreatePromotion(this.formCreatePromotion.value).toPromise().then(pro => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เพิ่มสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.formCreatePromotion.reset()
      this.closeModalCreatePromotion();
      this.getPromotionManage();
    }).catch(err => {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'โปรดลองใหม่อีกครั้ง',
        showConfirmButton: false,
        timer: 1000
      })
    })
  }

  editPromotion(){
    this.callapiPro.EditPromotion(this.formEditPromotion.value.promotion_id, this.formEditPromotion.value).toPromise().then(pro => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'แก้ไขสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.formEditPromotion.reset()
      this.closeModalEditPromotion();
      this.getPromotionManage();
    }).catch(err => {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'โปรดลองใหม่อีกครั้ง',
        showConfirmButton: false,
        timer: 1000
      })
    })
  }

  closeModalCreatePromotion() {
    this.closebuttonCreatePromotion.nativeElement.click();
  }
  closeModalEditPromotion() {
    this.closebuttonEditPromotion.nativeElement.click();
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  deletePromotion(id: any) {
    this.callapiPro.DeletePromotion(id).toPromise().then(pro => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'ลบสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closeModalEditPromotion();
      this.getPromotionManage();
    })
  }
}
