import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainEmployeeComponent } from './components/main-employee/main-employee.component';
import { OrderComponent } from './components/order/order.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ManageFoodComponent } from './components/manage-food/manage-food.component';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { ManageTableComponent } from './components/manage-table/manage-table.component';
import { IncomeComponent } from './components/income/income.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { OrderChefComponent } from './components/order-chef/order-chef.component';


const routes: Routes = [
  {path: '', component: MainEmployeeComponent},
  {path: 'mainEmployee', component: MainEmployeeComponent},
  {path: 'order', component: OrderComponent},
  {path: 'orderHistory', component: OrderHistoryComponent},
  {path: 'manageFood', component: ManageFoodComponent},
  {path: 'manageEmployee', component: ManageEmployeeComponent},
  {path: 'manageTable', component: ManageTableComponent},
  {path: 'income', component: IncomeComponent},
  {path: 'promotion', component: PromotionComponent},
  {path: 'orderChef', component: OrderChefComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
