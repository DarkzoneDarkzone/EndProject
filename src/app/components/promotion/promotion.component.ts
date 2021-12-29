import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { promotion } from 'src/app/models/promotion';
import { PromotionService } from 'src/app/services/promotion.service';
import Swal from 'sweetalert2';

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

  constructor(public callapiPro: PromotionService, public fb: FormBuilder) {
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
    this.getPromotionManage();
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
    this.callapiPro.GetPromotiosById(id).subscribe(pro => {
      this.patchValueFormEdit(pro);
    })
  }

  createPromotion(){
    this.formCreatePromotion.value.status = false;
    this.formCreatePromotion.value.value = parseInt(this.formCreatePromotion.value.value);
    console.log(this.formCreatePromotion.value);
    this.callapiPro.CreatePromotion(this.formCreatePromotion.value).subscribe(pro => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เพิ่มสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closeModalCreatePromotion();
      this.getPromotionManage();
    })
  }

  editPromotion(){
    this.callapiPro.EditPromotion(this.formEditPromotion.value.promotion_id, this.formEditPromotion.value).subscribe(pro => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'แก้ไขสำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closeModalEditPromotion();
      this.getPromotionManage();
    })
  }

  closeModalCreatePromotion() {
    this.closebuttonCreatePromotion.nativeElement.click();
  }
  closeModalEditPromotion() {
    this.closebuttonEditPromotion.nativeElement.click();
  }

}
