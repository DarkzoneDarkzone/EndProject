import { Component, OnInit } from '@angular/core';
import { CartOrderService } from 'src/app/services/cart-order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-order',
  templateUrl: './cart-order.component.html',
  styleUrls: ['./cart-order.component.css']
})
export class CartOrderComponent implements OnInit {
  cartOrder: any
  constructor(public callapicart: CartOrderService) { }

  ngOnInit(): void {
    this.getCart()
  }

  getCart() {
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
        this.cartOrder = data
    })
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }

}
