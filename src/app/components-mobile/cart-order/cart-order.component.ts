import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
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
  constructor(public callapicart: CartOrderService, public callapiorder: OrderService, public ds: DataService) {}

  ngOnInit(): void {
    this.getCart()
    this.getOrderTable()
  }
  getCart() {
    let prevAmount: any = 0
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
      if(data != null){
        this.cartOrder = data
        let arrayFood = data.foodList
        arrayFood.forEach((el: any) => prevAmount += el.amount)
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
  getOrderTable(){
    this.callapiorder.GetOrderByTableNumber(localStorage.getItem('tableNo')).subscribe(data => {
      this.tableOrder = data
    })
  }
  confirmOrderFood(){
    let total: number = 0
    this.cartOrder.foodList.forEach((el: any) => total + el.price);
    for (let i = 0; i < this.cartOrder.foodList.length; i++) {
      this.tableOrder.foodList.push(this.cartOrder.foodList[i])
    }
    this.tableOrder.priceTotal = total
    this.tableOrder.netPrice = total
    this.callapiorder.EditOrder(this.tableOrder.order_id, this.tableOrder).subscribe(data => {})
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
}
