import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CartOrderService } from 'src/app/services/cart-order.service';
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
  constructor(public callapicart: CartOrderService, public callapiorder: OrderService) {}

  ngOnInit(): void {
    this.getCart()
    this.getOrderTable()
  }
  getCart() {
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
        this.cartOrder = data
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
      console.log(data)
    })
  }
  confirmOrderFood(){
  }
}
