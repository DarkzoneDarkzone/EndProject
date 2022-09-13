import { Component, OnInit } from '@angular/core';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-promotion-customer',
  templateUrl: './promotion-customer.component.html',
  styleUrls: ['./promotion-customer.component.css']
})
export class PromotionCustomerComponent implements OnInit {
  showPromotion: any
  constructor(public callapiPro: PromotionService) { }

  ngOnInit(): void {
    this.getPromotionManage()
  }

  getPromotionManage(){
    this.callapiPro.GetPromotionManage().subscribe((pro: any) => {
      this.showPromotion = pro;
      this.showPromotion = this.showPromotion.filter((data: any) => data.status == true)
    })
  }
}
