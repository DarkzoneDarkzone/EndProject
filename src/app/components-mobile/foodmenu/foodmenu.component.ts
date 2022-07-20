import { Component, OnInit } from '@angular/core';
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
  constructor(
    public callapi: FoodService,
    public callapitype: TypeFoodService
  ) { }
  ngOnInit(): void {
    // this.spinner.show();
    this.getFood();
    this.getTypeData();
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 1000);
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
}