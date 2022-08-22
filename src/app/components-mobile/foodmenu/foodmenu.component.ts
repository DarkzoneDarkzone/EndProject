import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('closeModalMoreDetails') closeModalMoreDetails: any;

  showFood: any;
  allFood: any
  amount: number = 0
  moreDetails: string = ""
  formForArray: any
  arrayFood: food[] = []
  prevAmount: any = 0

  constructor(
    public callapiFood: FoodService,
    public callapitype: TypeFoodService,
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public ds: DataService
  ){}
  async ngOnInit() {
    await this.callapiFood.GetFood().toPromise().then(food => {
      this.allFood = food
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
    this.moreDetails = ""
    this.amount = 0
    this.formForArray = this.showFood.find((data: any) => data.food_id == id)
  }
  addFoodToArray() {
    if(this.amount > 0){
      this.arrayFood.forEach((data: any) => this.prevAmount += data.amount)
      // this.addFoodToArray.moreDetails = this.moreDetails
      if(this.checkArrayFood(this.formForArray.food_id)){
        for (let i = 0; i < this.arrayFood.length; i++) {
          if (this.arrayFood[i].food_id == this.formForArray.food_id) {
            this.arrayFood[i].amount += this.amount;
          }
        }
      } else {
        this.formForArray.amount = this.amount
        this.arrayFood.push(this.formForArray)
      }
      console.log(this.arrayFood)
      this.ds.sendData(this.prevAmount + this.amount)
      this.closeModalMoreDetail()
      this.prevAmount = 0
      this.amount = 0
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
  closeModalMoreDetail(){
    this.closeModalMoreDetails.nativeElement.click();
  }
}
