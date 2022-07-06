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
import { MobileLayoutComponent } from './layouts/mobile-layout/mobile-layout.component';
import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';
import { MenuComponent } from './components-mobile/menu/menu.component';
import { IndexComponent } from './components-mobile/index/index.component';
import { CallServiceComponent } from './components-mobile/call-service/call-service.component';
import { BillComponent } from './components-mobile/bill/bill.component';

const routes: Routes = [
  { 
    path: 'mobile', 
    component: MobileLayoutComponent,
    children: [
      { path: '', component: MenuComponent, pathMatch: 'full'},
      {path:'index', component:IndexComponent},
      {path:'menu',component:MenuComponent},
      {path:'order',component:OrderComponent},
      {path:'service',component:CallServiceComponent},
      {path:'bill',component:BillComponent}
    ]
  },
  {
    path: '',
    component: SystemLayoutComponent,
    children: [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
