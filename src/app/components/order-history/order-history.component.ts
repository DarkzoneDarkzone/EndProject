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
  @ViewChild('closebuttonShowModalPaymentAdmin') closebuttonShowModalPaymentAdmin: any;

  formOrderShow: any;
  formOrderAll: any;
  formOrderShowById: any;
  current_order: any;
  current_order_allpay: any;
  promotionAll: any;
  promotion_current: any;
  bank: any;
  employeeFromApi: any;
  submitConfirmPayment: boolean = false;
  submitConfirmPaymentAdmin: boolean = false;
  bankSelected: any = "";
  
  orderForPayment: any
  tableSelected: any = "";
  typePay: any = "";
  arrEmp: any[] = []
  showBillFood: any[] = []
  current_orderFood: any[] = []
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
      this.employeeFromApi.forEach((element: any) => {
        this.arrEmp[element.emp_Id] = element.emp_Name
      });
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
      this.orderForPayment = this.formOrderAll.filter((data: any) => data.status == "waitingFood")
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
        this.showBillFood = []
        this.formOrderShowById = e
        this.formOrderShowById.foodList.forEach((element: any) => {
          let searchArr = this.showBillFood.find((e) => e.food_id === element.food_id && e.status === element.status)
          if(!searchArr){
            this.showBillFood.push(element)
          } else {
            searchArr.amount += 1
            if(searchArr.chef_id?.indexOf(element.chef_id) < 0){
              searchArr.chef_id += ','+element.chef_id
            }
            if(searchArr.serve_id?.indexOf(element.serve_id) < 0){
              searchArr.serve_id += ','+element.serve_id
            }
          }
        });
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
    this.submitConfirmPayment = true
    if(this.bankSelected == ""){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุธนาคาร',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    let success_food = 0
    for (let i = 0; i < this.current_order.foodList.length; i++) {
      if(this.current_order.foodList[i].status != 'success'){
        success_food++
      }
    }
    if(success_food > 0){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'ยังได้รับอาหารไม่ครบ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.bankSelected == ""){
      this.bankSelected = 'cash'
    }
    this.callapi.PaymentOrder(this.current_order.order_id, this.current_order.status, this.bankSelected, localStorage.getItem('emp_id')).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closebuttonModalPayment()
      this.closebuttonModalPaymentAdmin()
      this.getOrderAll()
      this.submitConfirmPayment = false
      this.tableSelected = ""
      this.typePay = ""
      this.bankSelected = ""
    });
  }

  confirmPaymentChange(){
    this.submitConfirmPayment = true
    if(this.typePay == ""){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุวิธีการชำระ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.bankSelected == "" && this.typePay == 'payOnline'){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุธนาคาร',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    let success_food = 0
    for (let i = 0; i < this.current_order.foodList.length; i++) {
      if(this.current_order.foodList[i].status != 'success'){
        success_food++
      }
    }
    if(success_food > 0){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'ยังได้รับอาหารไม่ครบ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.bankSelected == ""){
      this.bankSelected = 'cash'
    }
    this.callapi.PaymentOrder(this.current_order.order_id, this.typePay, this.bankSelected, localStorage.getItem('emp_id')).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closebuttonModalPayment()
      this.closebuttonModalPaymentAdmin()
      this.getOrderAll()
      this.submitConfirmPayment = false
      this.tableSelected = ""
      this.typePay = ""
      this.bankSelected = ""
    });
  }

  confirmPaymentAll(){
    this.submitConfirmPayment = true
    if(this.tableSelected == ""){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาเลือกโต๊ะ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.typePay == ""){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุวิธีการชำระ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.bankSelected == "" && this.typePay == 'payOnline'){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'กรุณาระบุธนาคาร',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    let success_food = 0
    for (let i = 0; i < this.current_order_allpay.foodList.length; i++) {
      if(this.current_order_allpay.foodList[i].status != 'success'){
        success_food++
      }
    }
    if(success_food > 0){
      Swal.fire({
        position: 'top',
        icon: 'info',
        title: 'ยังได้รับอาหารไม่ครบ',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if(this.bankSelected == ""){
      this.bankSelected = 'cash'
    }
    this.callapi.PaymentOrder(this.current_order_allpay.order_id, this.typePay, this.bankSelected, localStorage.getItem('emp_id')).subscribe(order => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สำเร็จ',
        showConfirmButton: false,
        timer: 1000
      })
      this.closebuttonModalPayment()
      this.closebuttonModalPaymentAdmin()
      this.getOrderAll()
      this.submitConfirmPayment = false
      this.tableSelected = ""
      this.typePay = ""
      this.bankSelected = ""
    });
  }

  getPromotionManage(){
    this.callapiPro.GetPromotionManage().subscribe(pro => {
      this.promotionAll = pro;
    })
  }

  selectOrder(id: string){
    this.current_order = this.formOrderAll.find((el: any) => el.order_id == id)
    this.getOrderById(this.current_order.order_id)
    this.promotion_current = this.promotionAll.find((el: any) => el.promotion_id == this.current_order.promotion)
  }

  selectOrderAdmin(){
    this.current_order_allpay = this.formOrderAll.find((el: any) => el.order_id == this.tableSelected)
    this.formOrderAll.find((e: any) => {
      if(e.order_id == this.current_order_allpay.order_id){
        this.current_orderFood = []
        this.formOrderShowById = e
        this.formOrderShowById.foodList.forEach((element: any) => {
          let searchArr = this.current_orderFood.find((e) => e.food_id === element.food_id && e.status === element.status)
          if(!searchArr){
            this.current_orderFood.push(element)
          } else {
            searchArr.amount += 1
            if(searchArr.chef_id?.indexOf(element.chef_id) < 0){
              searchArr.chef_id += ','+element.chef_id
            }
            if(searchArr.serve_id?.indexOf(element.serve_id) < 0){
              searchArr.serve_id += ','+element.serve_id
            }
          }
        });
      }
    })
    this.promotion_current = this.promotionAll.find((el: any) => el.promotion_id == this.current_order.promotion)
  }

  closeModalShowDetail(){
    this.closebuttonShowDetail3.nativeElement.click();
  }

  closebuttonModalPayment(){
    this.closebuttonShowModalPayment.nativeElement.click();
  }
  closebuttonModalPaymentAdmin(){
    this.closebuttonShowModalPaymentAdmin.nativeElement.click();
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
    this.formOrderShowById.foodList = this.formOrderShowById.foodList.filter((data: any) => data.id != id);
    this.callapi.EditOrder(this.formOrderShowById.order_id, this.formOrderShowById).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'นำรายการอาหารออกแล้ว',
        showConfirmButton: false,
        timer: 1000
      })
      this.getOrderAll()
    })
  }
}
