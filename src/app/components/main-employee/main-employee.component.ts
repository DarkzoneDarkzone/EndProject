import { Component, OnInit, ViewChild} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { food } from 'src/app/models/food';
import { order } from 'src/app/models/order';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { TableService } from 'src/app/services/table.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-main-employee',
  templateUrl: './main-employee.component.html',
  styleUrls: ['./main-employee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  @ViewChild('closebuttonOrder') closebuttonOrder: any;
  @ViewChild('closebuttonBackOrder') closebuttonBackOrder: any;
  @ViewChild('closebuttonOrderHistory') closebuttonOrderHistory: any;
  @ViewChild('closebuttonShowOrderDetail') closebuttonShowOrderDetail: any;
  @ViewChild('closebuttonShowPromotion') closebuttonShowPromotion: any;

  formCreateOrder: any;


  showFood: any;
  typeSearch: any;
  arrayFood : food[] = [];
  submitCreate: boolean = false;
  idShow: any;
  totalPrice: any;
  valuePromotion: any = 0;
  netPrice: any;
  formShowPromotion: any;

  amountt: number = 0;
  formPromotion: any;
  tableAll: any;

  constructor(
    public fb: UntypedFormBuilder, 
    public callapiFood: FoodService, 
    public callapiTable: TableService,  
    public callapi: OrderService, 
    public callapipro: PromotionService, 
    private spinner: NgxSpinnerService
  ){
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: [null],
      typeOrder: [null],
      number: [null],
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
      creationDatetime: null,
      emp_Name: null,
      paytime: null,
      netPrice: 0,
      valuePromotion: 0
    })
   }

  ngOnInit(): void {
    this.spinner.show();
    this.getOrderAll();
    this.getFood();
    this.getPromotionAll();
    this.getTableAll()
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  getOrderAll(): void {
    this.callapi.GetOrder().subscribe(data => {
      // var dataReceive = data;
      this.idShow = data;
      this.idShow = "Order0"+this.idShow.length;
    })
  }

  getTableAll(){
    this.callapiTable.getTable().subscribe(data => {
      this.tableAll = data
    })
  }

  closeModalOrderHistory(){
    this.closebuttonOrderHistory.nativeElement.click();
  }
  closeModalPromotion(){
    this.closebuttonShowPromotion.nativeElement.click();
  }

  closeModalShowOrderDetail(){
    this.closebuttonShowOrderDetail.nativeElement.click();
  }

  closeModalOrder(){
    this.submitCreate = false;
    this.closebuttonOrder.nativeElement.click();
  }

  closeModalBackOrder(){
    this.submitCreate = false;
    this.closebuttonBackOrder.nativeElement.click();
  }

  getFood(){
    this.callapiFood.GetFood().subscribe(food => {
      this.showFood = food;
    })
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

  addFoodToArray(id: string){
    this.callapiFood.GetFoodById(id).subscribe( food => {
      food.amount = 1;
      this.arrayFood.push(food);
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เพิ่มรายการอาหารแล้ว',
        showConfirmButton: false,
        timer: 700
      })
      this.calculatePrice();
    })
  }

  addFoodAmount(id: string){
    for(let i = 0; i < this.arrayFood.length; i++){
      if(this.arrayFood[i].food_id == id){
        this.callapiFood.GetFoodById(id).subscribe( food => {
          this.arrayFood[i].amount += 1;
          this.arrayFood[i].price += food.price;
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'สั่งรายการอาหารเพิ่มแล้ว',
            showConfirmButton: false,
            timer: 700
          })
          this.calculatePrice();
        })
      }
    }
  }

  calculatePrice() {
    this.totalPrice = 0;
    for(let i = 0; i < this.arrayFood.length; i++){
      this.totalPrice += this.arrayFood[i].price;
    }
    if(this.formPromotion == null || this.formPromotion == undefined) {
      this.valuePromotion = 0;
    } else if(this.formPromotion.type == 'bath'){
      this.valuePromotion = this.formPromotion.value;
    } else if(this.formPromotion.type == 'percent'){
      this.valuePromotion = (this.formPromotion.value*this.totalPrice)/100;
    }
    this.netPrice = this.totalPrice - this.valuePromotion;
  }

  getPromotionById(id: string){
    this.callapipro.GetPromotionById(id).subscribe(data => {
      this.formPromotion = data;
      this.calculatePrice();
      this.closeModalPromotion();
    })
  }

  getPromotionAll(){
    this.callapipro.GetPromotionShow().subscribe(data => {
      this.formShowPromotion = data;
    })
  }

  deleteArray(){
    this.arrayFood = [];
    this.totalPrice = 0;
    this.valuePromotion = 0;
    this.netPrice = 0;
    this.formPromotion = null;
  }

  checkArrayFood(id: string) {
    for( let i = 0; i < this.arrayFood.length; i++ ){
      if ( this.arrayFood[i].food_id == id ){
        return true;
      }
    }
    return false;
  }

  createOrder() {
    this.submitCreate = true;
    this.formCreateOrder.value.status = 'waitingFood';
    this.formCreateOrder.value.priceTotal = this.totalPrice;
    if(this.formPromotion?.promotion_id == undefined){
      this.formCreateOrder.value.promotion = null;
    } else {
      this.formCreateOrder.value.promotion = this.formPromotion.promotion_id;
    }
    if(this.formCreateOrder.value.number == null)
    {
      this.formCreateOrder.value.number = 0;
    }
    if (this.formCreateOrder.valid) {
      this.formCreateOrder.value.creationDatetime = new Date();
      this.formCreateOrder.value.foodList = this.arrayFood;
      this.formCreateOrder.value.netPrice = this.netPrice;
      this.callapi.CreateOrder(this.formCreateOrder.value).subscribe(order => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'สั่งอาหารสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.arrayFood = [];
        this.getOrderAll();
      });
    }
  }

  get formValidCreateOrder() {
    return this.formCreateOrder.controls;
  }
}
