import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { food } from 'src/app/models/food';
import { CartOrderService } from 'src/app/services/cart-order.service';
import { DataService } from 'src/app/services/data.service';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-foodmenu',
  templateUrl: './foodmenu.component.html',
  styleUrls: ['./foodmenu.component.css']
})
export class FoodmenuComponent implements OnInit {
  @ViewChild('closeModalMoreDetails') closeModalMoreDetails: any;

  showFood: any;
  allFood: any
  amount: number = 0
  moreDetails: string = ""
  formForArray: any
  arrayFood: any = []
  prevAmount: any = 0
  cartOrder: any
  tableOrder: any

  constructor(
    public callapiFood: FoodService,
    public callapitype: TypeFoodService,
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public ds: DataService,
    public callapicart: CartOrderService,
    public callapiorder: OrderService
  ){}
  async ngOnInit() {
    await this.getFoodAll()
    let recommend = this.route.snapshot.queryParamMap.get("recommend")
    let typeId = this.route.snapshot.queryParamMap.get("typeId")
    if(recommend == "true"){
      this.showFood = this.allFood.filter((data: any) => data.recommend)
    } else {
      this.showFood = this.allFood.filter((data: any) => data.typeid == typeId)
    }
    this.getCart()
  }
  async getFoodAll(){
    await this.callapiFood.GetFood().toPromise().then(food => {
      this.allFood = food
    })
  }
  getCart() {
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
      if(data != null){
        this.cartOrder = data
        this.arrayFood = data.foodList
        this.arrayFood.forEach((el: any) => this.prevAmount += el.amount)
        this.ds.sendData(this.prevAmount + this.amount)
      }
    })
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
  reduceAmount(){
    if(this.amount >= 1){
      this.amount--
    }
  }
  increaseAmount(){
    if(this.amount <= 20){
      this.amount++
    }
  }
  handleSelectFood(id: string){
    this.moreDetails = ""
    this.amount = 0
    this.formForArray = this.showFood.find((data: any) => data.food_id == id)
  }
  async addFoodToArray() {
    await this.getOrderTable()
    if(this.tableOrder != null && this.tableOrder != undefined && this.tableOrder.status == 'waitingFood'){
      if(this.amount > 0){
        this.arrayFood.forEach((data: any) => this.prevAmount += data.amount)
        this.formForArray.moreDetails = this.moreDetails
        if(this.checkArrayFood(this.formForArray.food_id)){
          for (let i = 0; i < this.arrayFood.length; i++) {
            if (this.arrayFood[i].food_id == this.formForArray.food_id) {
              this.arrayFood[i].amount += this.amount;
              this.arrayFood[i].status = "pending";
            }
          }
        } else {
          this.formForArray.amount = this.amount
          this.formForArray.status = "pending"
          this.arrayFood.push(this.formForArray)
        }
        if(this.cartOrder != null){
          this.cartOrder.foodList = this.arrayFood
          this.callapicart.EditCartOrder(this.cartOrder.cart_id, this.cartOrder).subscribe(data => {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'เพิ่มรายการอาหารแล้ว',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              this.getFoodAll()
              this.getCart()
              this.closeModalMoreDetail()
              this.prevAmount = 0
              this.amount = 0
            })
          })
        } else {
          this.cartOrder = {
            table_NO: localStorage.getItem('tableNo'),
            foodList: this.arrayFood
          }
          this.callapicart.CreateCartOrder(this.cartOrder).subscribe(data => {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'เพิ่มรายการอาหารแล้ว',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              this.getFoodAll()
              this.getCart()
              this.closeModalMoreDetail()
              this.prevAmount = 0
              this.amount = 0
            })
          })
        }
      }
    } else {
      Swal.fire({
        position: 'top',
        icon: 'error',
        title: 'ไม่สามารถสั่งอาหารได้',
        showConfirmButton: false,
        timer: 1000
      })
    }
  }
  async getOrderTable(){
    await this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).toPromise().then(data => {
      this.tableOrder = data
    })
  }
  checkArrayFood(id: string){
    for (let i = 0; i < this.arrayFood.length; i++) {
      if (this.arrayFood[i].food_id == id) {
        return true;
      }
    }
    return false;
  }
  closeModalMoreDetail(){
    this.closeModalMoreDetails.nativeElement.click();
  }
}
