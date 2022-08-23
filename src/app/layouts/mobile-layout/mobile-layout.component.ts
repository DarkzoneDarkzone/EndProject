import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartOrderService } from 'src/app/services/cart-order.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mobile-layout',
  templateUrl: './mobile-layout.component.html',
  styleUrls: ['./mobile-layout.component.css'],
})
export class MobileLayoutComponent implements OnInit {
  subscription: any
  dataPassed: any
  tableNo : any = null
    
    constructor(public ds: DataService, private route: ActivatedRoute, public callapicart: CartOrderService) {}

  ngOnInit(): void {
    this.subscription = this.ds.getData().subscribe(x => {
      this.dataPassed = x;
    });
    this.callapicart.GetCartOrderByNo(localStorage.getItem('tableNo')).subscribe(data => {
      let amount = 0
      if(data != null){
        data.foodList.forEach((el: any) => amount += el.amount)
      }
      this.ds.sendData(amount)
    })
    this.ds.sendData(0);
    
    this.tableNo = this.route.snapshot.queryParamMap.get('number')
    if(this.tableNo != null){
      localStorage.setItem('tableNo', this.tableNo);
    } else {
      this.tableNo = localStorage.getItem('tableNo')
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
