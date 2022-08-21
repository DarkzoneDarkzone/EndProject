import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { food } from 'src/app/models/food';
import { DataService } from 'src/app/services/data.service';
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
  allFood: any
  amount: number = 0
  formForArray: any
  arrayFood: food[] = []
  subscription: any
  dataPassed: any
  constructor(
    public callapiFood: FoodService,
    public callapitype: TypeFoodService,
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public ds: DataService
  ) {}
  async ngOnInit() {
    await this.callapiFood.GetFood().toPromise().then(food => {
      this.allFood = food
    })
    this.ds.getData().subscribe(e => {
      console.log(e)
    })
    let recommend = this.route.snapshot.queryParamMap.get("recommend")
    let typeId = this.route.snapshot.queryParamMap.get("typeId")
    if(recommend == "true"){
      this.showFood = this.allFood.filter((data: any) => data.recommend)
    } else {
      this.showFood = this.allFood.filter((data: any) => data.typeid == typeId)
    }
  }
  async getFood(): Promise<any> {
    await this.callapiFood.GetFood().toPromise().then(food => {
      this.allFood = food
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
    this.amount++
  }
  handleSelectFood(id: string){
    this.amount = 0
    this.formForArray = this.showFood.find((data: any) => data.food_id == id)
  }
  addFoodToArray() {
    
    // this.subscription = this.ds.getData().subscribe(x => {                  
    //   this.dataPassed = x; 
    // });
    if(this.amount > 0){
      if(this.checkArrayFood(this.formForArray.food_id)){
        for (let i = 0; i < this.arrayFood.length; i++) {
          if (this.arrayFood[i].food_id == this.formForArray.food_id) {
            // this.ds.sendData(this.dataPassed + this.amount);
            this.arrayFood[i].amount += this.amount;
          }
        }
      } else {
        // this.ds.sendData(this.dataPassed + this.amount);
        this.formForArray.amount = this.amount
        this.arrayFood.push(this.formForArray)
      }
    }

  }
  checkArrayFood(id: string){
    for (let i = 0; i < this.arrayFood.length; i++) {
      if (this.arrayFood[i].food_id == id) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}