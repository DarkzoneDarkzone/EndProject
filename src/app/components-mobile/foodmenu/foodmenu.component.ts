import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { food } from 'src/app/models/food';
import { FoodService } from 'src/app/services/food.service';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-foodmenu',
  templateUrl: './foodmenu.component.html',
  styleUrls: ['./foodmenu.component.css']
})
export class FoodmenuComponent implements OnInit {
  showFood: any;
  typeData: any;
  searchText: any;
  filterFood: any;
  amountt: number = 0;
  arrayFood : food [] =[]
  formCreateOrder: any;
  constructor(
    public callapi: FoodService,
    public callapiFood: FoodService, 
    public callapitype: TypeFoodService,
    public fb: UntypedFormBuilder, 
    
  )
  {this.formCreateOrder = this.fb.group({
    order_id: null,
    table_NO: [null, [Validators.required]],//
    number: [null, [Validators.required]],//
    typeOrder: [null],
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
    creationDatetime: null,
    emp_Name: null,
    paytime: null,
    netPrice: 0,
    valuePromotion: 0
  })}
  ngOnInit(): void {
    // this.spinner.show();
    this.getFood();
    this.getTypeData();
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);
  }
  num:number = 0;
  increment(): void{
      this.num += 1
    }
    del(): void{
      this.num = this.num - 1
    }
  getFood(){
    this.callapi.GetFood().subscribe(food => {
      this.showFood = food;
      
    })
  }
  getTypeData(){
    this.callapitype.GetType().subscribe( tf => {
      this.typeData = tf;
    })
    

  }
  
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
  addFoodAmount(id: string){
    for(let i = 0; i < this.arrayFood.length; i++){
      if(this.arrayFood[i].food_id == id){
        this.callapiFood.GetFoodById(id).subscribe( food => {
          this.arrayFood[i].amount += 1;
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
 
  
}
 
