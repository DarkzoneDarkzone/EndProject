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
  @ViewChild('closebuttonOrderHistory') closebuttonOrderHistory: any;
  @ViewChild('closebuttonShowOrderDetail') closebuttonShowOrderDetail: any;

  formCreateOrder: any;


  showFood: any;
  typeSearch: any;
  arrayFood : food[] = [];
  submitCreate: boolean = false;

  amountt: number = 0;

  constructor(public fb: FormBuilder, public callapiFood: FoodService,  public callapi: OrderService) {
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
      creationDatetime: null
    })
   }

  ngOnInit(): void {

    this.getFood();
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
      this.formCreateOrder.value.typeOrder = "onsite";
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

  deleteArray(){
    this.arrayFood = [];
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
    this.formCreateOrder.value.number = 0;
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
      });
      this.arrayFood = [];
    }
  }

  get formValidCreateOrder() {
    return this.formCreateOrder.controls;
  }
  
 
}
