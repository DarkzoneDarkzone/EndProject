import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { TableService } from 'src/app/services/table.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  @ViewChild('closeModalSelectPay') closeModalSelectPay: any;
  constructor(public callapiorder: OrderService, public callapitable: TableService, public callapiPro: PromotionService) {}
  tableOrder: any
  tableByNo: any
  promotionId: any
  totalPrice: any = 0
  promotion: any
  valuePromotion: any = 0
  currentDate: any = new Date()
  table: any = localStorage.getItem('tableNo')
  ngOnInit(): void {
    this.getOrderTable()
    this.getTableByNumber()
  }
  getOrderTable(){
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
      this.totalPrice = this.tableOrder?.priceTotal
      this.valuePromotion = data.valuePromotion
    })
  }
  getTableByNumber(){
    this.callapitable.getTableByNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableByNo = data
    })
  }
  handlePayment(type: any){
    this.tableOrder.status = type
    if(this.promotion != null || this.promotion != undefined){
      this.tableOrder.promotion = this.promotion.promotion_id
      this.tableOrder.valuePromotion = Math.floor(this.valuePromotion)
    }
    this.tableOrder.netPrice = Math.floor(this.totalPrice) - Math.floor(this.valuePromotion)
    let foodNotSuccess = 0
    this.tableOrder.foodList.forEach((element: any) => {
      if(element.status != 'success'){
        foodNotSuccess ++
      }
    });
    if(foodNotSuccess > 0){
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'มีรายการที่ยังไม่ได้รับ',
        showConfirmButton: false,
        timer: 1500
      })
      return
    }
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
  usePromotion(){
    this.callapiPro.GetPromotionById(this.promotionId.toUpperCase()).subscribe((pro: any) => {
      this.promotion = pro;
      this.calculatePrice()
    })
  }
  romovePromotion(){
    this.promotion = null
    this.promotionId = null
    this.calculatePrice()
  }
  calculatePrice() {
    if(this.promotion == null || this.promotion == undefined) {
      this.valuePromotion = 0;
    } else if(this.promotion.type == 'bath'){
      this.valuePromotion = Math.floor(this.promotion.value);
    } else if(this.promotion.type == 'percent'){
      this.valuePromotion = Math.floor((this.promotion.value*this.totalPrice)/100);
    }
  }
}
