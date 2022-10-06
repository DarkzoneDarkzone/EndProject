import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { food } from 'src/app/models/food';
import { CartOrderService } from 'src/app/services/cart-order.service';
import { DataService } from 'src/app/services/data.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.css']
})
export class CartOrderComponent implements OnInit {
  cartOrder: any
  tableOrder: any
  formCreateOrder: any
  arrayFood: any
  constructor(public callapicart: CartOrderService, public callapiorder: OrderService, public ds: DataService) { }

  ngOnInit(): void {
    this.getCart()
    this.getOrderTable()
  }
  getCart() {
    let prevAmount: any = 0
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
      if (data != null) {
        this.cartOrder = data
        let arrayFoods = data.foodList
        arrayFoods.forEach((el: any) => prevAmount += el.amount)
      } else {
        this.cartOrder = null
      }
      this.ds.sendData(prevAmount)
    })
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
  cancelAllFood() {
    this.callapicart.DeleteCartOrder(this.cartOrder.cart_id).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'ยกเลิกรายการอาหารแล้ว',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.getCart()
      })
    })
  }
  getOrderTable() {
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
      this.arrayFood = data.foodList
    })
  }
  confirmOrderFood() {
    let total: number = 0
    for (let i = 0; i < this.cartOrder.foodList.length; i++) {
      const num = this.cartOrder.foodList[i].amount
      for (let j = 0; j < num; j++) {
        let foods = {
          id: new Date().getTime().toString() + j,
          status: 'wait',
          amount: 1,
          chef_id: null,
          display: this.cartOrder.foodList[i].display,
          food_id: this.cartOrder.foodList[i].food_id,
          imgPath: this.cartOrder.foodList[i].imgPath,
          moreDetails: this.cartOrder.foodList[i].moreDetails,
          name: this.cartOrder.foodList[i].name,
          price: this.cartOrder.foodList[i].price,
          recommend: this.cartOrder.foodList[i].recommend,
          serve_id: null,
          type: this.cartOrder.foodList[i].type,
          typeid: this.cartOrder.foodList[i].typeid,
        }
        this.arrayFood.push(foods)
      }
    }
    this.arrayFood.forEach((el: any) => {
      total += el.price * el.amount
    });
    this.tableOrder.priceTotal = total
    this.tableOrder.netPrice = total
    this.tableOrder.foodList = this.arrayFood
    this.callapiorder.EditOrder(this.tableOrder.order_id, this.tableOrder).subscribe(data => { })
    this.callapicart.DeleteCartOrder(this.cartOrder.cart_id).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'สั่งอาหารแล้ว',
        showConfirmButton: false,
        timer: 1000
      })
      this.getCart()
      this.getOrderTable()
    })
  }

  reduceAmount(id: any){
    let food = this.cartOrder.foodList.find((el: any) => el.id == id)
    if(food.amount > 1){
      food.amount--
    } else {
      Swal.fire({
        title: 'ต้องการนำรายการอาหารออกหรือไม่?',
        confirmButtonText: 'ต้องการ',
        showCancelButton: true,
        cancelButtonText: 'ไม่ต้องการ',
      }).then((e) => {
        if(e.isConfirmed){
          this.cartOrder.foodList = this.cartOrder.foodList.filter((el: any) => el.id != id)
          this.removeFoodFromArray()
        }
      })
    }
  }

  increaseAmount(id: any){
    let food = this.cartOrder.foodList.find((el: any) => el.id == id)
    if(food.amount <= 20){
      food.amount++
    }
  }

  removeFoodFromArray(){
    this.callapicart.EditCartOrder(this.cartOrder.cart_id, this.cartOrder).subscribe(data => {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'นำรายการอาหารออกแล้ว',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.getCart()
        this.getOrderTable()
      })
    })
  }
}
