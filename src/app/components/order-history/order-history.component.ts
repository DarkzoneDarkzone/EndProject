import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { PromotionService } from 'src/app/services/promotion.service';
import { FoodService } from 'src/app/services/food.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  @ViewChild('closebuttonShowDetail3') closebuttonShowDetail3: any;
  @ViewChild('closebuttonShowModalPayment') closebuttonShowModalPayment: any;

  formOrderShow: any;
  formOrderAll: any;
  formOrderShowById: any;
  bankSelected: any = "";
  current_order: any;
  promotionAll: any;
  promotion_current: any;
  bank: any;
  employeeFromApi: any;
  constructor(
    public fb: UntypedFormBuilder,
    public callapi: OrderService,
    public callapiPro: PromotionService,
    public callapiFood: FoodService,
    public callapiEmp: EmployeeService,
    private spinner: NgxSpinnerService
  ){
    this.formOrderShowById = this.fb.group({
      order_id: null,
      table_NO: null,
      number: null,
      priceTotal: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null,
        imgPath: null,
        status: null,
        amount: 0
      }],
      status: null,
      creationDatetime: null
    })
   }

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getOrderAll(), this.getEmployee()]).then((values) => {
      this.spinner.hide();
    });
    this.getPromotionManage()
    this.getฺBankAll()
  }

  getEmployee() {
    this.callapiEmp.GetEmployee().subscribe(emp => {
      this.employeeFromApi = emp;
    })
  }

  patchValueFormShow(data: order){
    this.formOrderShowById.patchValue({
      order_id : data.order_id,
      table_NO : data.table_NO,
      number: data.number,
      priceTotal: data.priceTotal,
      foodList : data.foodList,
      status : data.status,
      creationDateTime : data.creationDatetime
    })
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderAll = od
      this.formOrderAll.reverse();
      this.formOrderShow = this.formOrderAll
    })
  }

  getฺBankAll(){
    this.callapiFood.GetBank().subscribe(od => {
      this.bank = od
    })
  }

  getOrderById(id:string){
    this.formOrderAll.find((e: any) => {
      if(e.order_id == id){
        this.formOrderShowById = e
      }
    })
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

  confirmPayment(){
    this.callapi.PaymentOrder(this.current_order.order_id, this.current_order.status, this.bankSelected).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closebuttonModalPayment()
      this.getOrderAll()
    });
  }

  getPromotionManage(){
    this.callapiPro.GetPromotionManage().subscribe(pro => {
      this.promotionAll = pro;
    })
  }

  selectOrder(id: string){
    this.current_order = this.formOrderAll.find((el: any) => el.order_id == id)
    this.promotion_current = this.promotionAll.find((el: any) => el.promotion_id == this.current_order.promotion)
  }

  closeModalShowDetail(){
    this.closebuttonShowDetail3.nativeElement.click();
  }

  closebuttonModalPayment(){
    this.closebuttonShowModalPayment.nativeElement.click();
  }

  filterStatus(status: string){
    if(status == ''){
      this.formOrderShow = this.formOrderAll
    } else if(status == 'waitingPayment'){
      this.formOrderShow = this.formOrderAll.filter((data: any) => data.status == 'payOnsite' || data.status == 'payOnline')
    } else {
      this.formOrderShow = this.formOrderAll.filter((data: any) => data.status == status)
    }
  }

  romovePromotion(){
    this.promotion_current = null
    this.current_order.valuePromotion = 0;
    this.current_order.promotion = null;
    this.current_order.netPrice = this.current_order.priceTotal;
    this.callapi.EditOrder(this.current_order.order_id, this.current_order).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'นำโปรโมชั่นออกแล้ว',
        showConfirmButton: false,
        timer: 1000
      })
    })
  }

  onDeleteFood(id: any){
    this.formOrderShowById.foodList = this.formOrderShowById.foodList.filter((data: any) => data.food_id != id);
    this.callapi.EditOrder(this.formOrderShowById.order_id, this.formOrderShowById).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'นำรายการอาหารออกแล้ว',
        showConfirmButton: false,
        timer: 1000
      })
      this.getOrderAll()
      this.closeModalShowDetail()
    })
  }
}
