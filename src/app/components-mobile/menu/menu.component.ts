import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FoodService } from 'src/app/services/food.service';
import { TypeFoodService } from 'src/app/services/type-food.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  typeFoodAll: any
  table_number: any
  constructor(
    public callApiTf: TypeFoodService, 
    public callapiFood: FoodService, 
    private router: Router, 
    private route: ActivatedRoute,

  ) { }
  ngOnInit(): void {
    this.getTypeFood()
  }
  getTypeFood() {
    this.callApiTf.GetType().subscribe(data => {
      this.typeFoodAll = data
    })
  }
  public showImages = (serverPath: string) => {
    return `${environment.apiUrlForImg}/${serverPath}`;
  }
  handleShowFood(id: string, recommend: boolean){
    this.router.navigate(['/mobile/foodmenu'], {queryParams: {typeId: id, recommend: recommend}})
  }
}