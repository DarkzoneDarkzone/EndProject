import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { order } from 'src/app/models/order';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-main-employee',
  templateUrl: './main-employee.component.html',
  styleUrls: ['./main-employee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  @ViewChild('closebuttonOrder') closebuttonOrder: any;
  @ViewChild('closebuttonBackOrder') closebuttonBackOrder: any;

  formCreateOrder: any;
  formOrderShow: any;
  formOrderShowById: any;
  showFood: any;

  constructor(public fb: FormBuilder, public callapi: OrderService, public callapiFood: FoodService) {
    this.formCreateOrder = this.fb.group({
      order_id: null,
      table_NO: null,
      cus_Name: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null,
        imgPath: null
      }],
      status: null,
      creationDatetime: null
    }),
    this.formOrderShowById = this.fb.group({
      order_id: null,
      table_NO: null,
      cus_Name: null,
      foodList: [{
        food_id: null,
        name: null,
        type: null,
        price: null,
        imgPath: null
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
      cus_Name : data.cus_Name,
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
  }

  closeModalOrder(){
    this.closebuttonOrder.nativeElement.click();
  }
  closeModalBackOrder(){
    this.closebuttonBackOrder.nativeElement.click();
  }

  getFood(){
    this.callapiFood.GetFood().subscribe(food => {
      this.showFood = food;
      console.log(this.showFood);
      
    })
  }

  public showImages = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
  
}
