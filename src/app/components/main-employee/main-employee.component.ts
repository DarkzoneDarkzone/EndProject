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
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';

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
  wordTypeSearch: any;
  arrayFood : food[] = [];
  submitCreate: boolean = false;
  idShow: any;
  totalPrice: any;
  valuePromotion: any = 0;
  netPrice: any;
  formShowPromotion: any;
  recommend:any 

  amountt: number = 0;
  formPromotion: any;
  tableAll: any;
  besttype: any
  foodFilter: any
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
      table_NO: [null, [Validators.required]],
      number: [null, [Validators.required]],
      priceTotal: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null,
        imgPath: null,
        status: null,
        display: null,
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
    Promise.all([this.getBestType(), this.getOrderAll(), this.getFood(), this.getPromotionAll(), this.getTableAll()]).then((values) => {
      this.spinner.hide();
    });
  }

  filterType(word: any){
    if(word == 'recommend'){
      this.foodFilter = this.showFood.filter((data: any) => data.recommend == true);
      this.wordTypeSearch = ''
    } else {
      this.foodFilter = this.showFood
      this.wordTypeSearch = word
    }
  }

  getBestType(){
    this.callapi.GetBestType().toPromise().then(data => {
      this.besttype = data
    })
  }

  getOrderAll(): void {
    this.callapi.GetOrder().subscribe(data => {
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
      this.foodFilter = food
    })
  }

  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

  addFoodToArray(id: string){
    this.callapiFood.GetFoodById(id).subscribe( food => {
      food.amount = 1;
      food.status = "pending"
      this.arrayFood.push(food);
      this.calculatePrice();
    })
  }

  removeFoodFromArray(id: string){
      this.arrayFood.forEach((data: any, index: any) => {
        if(data.food_id == id){
          this.arrayFood.splice(index, 1)
        }
      })
      this.calculatePrice();
  }

  addFoodAmount(id: string){
    for(let i = 0; i < this.arrayFood.length; i++){
      if(this.arrayFood[i].food_id == id){
        this.callapiFood.GetFoodById(id).subscribe( food => {
          this.arrayFood[i].amount += 1;
          this.arrayFood[i].price += food.price;
          this.calculatePrice();
        })
      }
    }
  }

  removeFoodAmount(id: string){
    for(let i = 0; i < this.arrayFood.length; i++){
      if(this.arrayFood[i].food_id == id){
        this.callapiFood.GetFoodById(id).subscribe( food => {
          if(this.arrayFood[i].amount == 1){
            Swal.fire({
              title: 'ต้องการนำสินค้าออกหรือไม่?',
              confirmButtonText: 'ต้องการ',
              showCancelButton: true,
              cancelButtonText: 'ไม่ต้องการ',
              reverseButtons: true
            }).then((e) => {
              if(e.isConfirmed){
                this.removeFoodFromArray(this.arrayFood[i].food_id)
              }
            })
          } else {
            this.arrayFood[i].amount -= 1;
            this.arrayFood[i].price -= food.price;
          }
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
        this.formCreateOrder.value = null
        this.formPromotion = null
        this.totalPrice = 0
        this.arrayFood = [];
        this.getOrderAll();
        this.submitCreate = false;
      });
    }
  }

  get formValidCreateOrder() {
    return this.formCreateOrder.controls;
  }
}
