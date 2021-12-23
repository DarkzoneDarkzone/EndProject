import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { food } from 'src/app/models/food';
import { order } from 'src/app/models/order';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-employee',
  templateUrl: './main-employee.component.html',
  styleUrls: ['./main-employee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  @ViewChild('closebuttonOrder') closebuttonOrder: any;
  @ViewChild('closebuttonBackOrder') closebuttonBackOrder: any;
  @ViewChild('closebuttonShowDetail') closebuttonShowDetail: any;
  @ViewChild('closebuttonOrderHistory') closebuttonOrderHistory: any;
  @ViewChild('closebuttonShowOrderDetail') closebuttonShowOrderDetail: any;

  formCreateOrder: any;
  formOrderShow: any;
  formOrderShowById: any;
  showFood: any;
  arrayFood : food[] = [];
  submitCreate: boolean = false;

  amountt: number = 0;

  constructor(public fb: FormBuilder, public callapi: OrderService, public callapiFood: FoodService) {
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: [null],
      typeOrder: [null,[Validators.required]],
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
      creationDatetime: null
    }),
    this.formOrderShowById = this.fb.group({
      order_id: null,
      table_NO: null,
      typeOrder: null,
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
    this.getOrderAll();
    this.getFood();
  }

  patchValueFormShow(data: order){
    this.formOrderShowById.patchValue({
      order_id : data.order_id,
      table_NO : data.table_NO,
      typeOrder : data.typeOrder,
      number: data.number,
      priceTotal: data.priceTotal,
      foodList : data.foodList,
      status : data.status,
      creationDateTime : data.creationDatetime
    })
  }

  getOrderAll(){
    this.callapi.GetOrder().subscribe(od => {
      this.formOrderShow = od
    })
  }

  getOrderById(id:string){
    this.callapi.GetOrderById(id).subscribe(od => {
      this.patchValueFormShow(od);      
    })
    this.closeModalOrderHistory();
  }

  closeModalOrderHistory(){
    this.closebuttonOrderHistory.nativeElement.click();
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

  closeModalShowDetail(){
    this.closebuttonShowDetail.nativeElement.click();
  }

  getFood(){
    this.callapiFood.GetFood().subscribe(food => {
      this.showFood = food;
      console.log(this.showFood);
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
        })
      }
    }
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
    this.formCreateOrder.value.priceTotal = 0;
    if(this.formCreateOrder.value.number == null)
    {
      this.formCreateOrder.value.number = 0;
    }
    if (this.formCreateOrder.valid) {
      this.formCreateOrder.value.creationDateTime = new Date();
      this.formCreateOrder.value.foodList = this.arrayFood;
      this.callapi.CreateOrder(this.formCreateOrder.value).subscribe(order => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'สั่งอาหารสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getOrderAll();
      });
      this.closeModalOrder();
      this.closeModalBackOrder();
      this.arrayFood = [];
    }
  }

  get formValidCreateOrder() {
    return this.formCreateOrder.controls;
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
      this.getOrderAll();
    });
  }
}
