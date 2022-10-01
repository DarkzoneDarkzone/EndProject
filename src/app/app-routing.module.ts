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
import { BillComponent } from './components-mobile/bill/bill.component';
import { FoodmenuComponent } from './components-mobile/foodmenu/foodmenu.component';
import { ManageTypefoodComponent } from './components/manage-typefood/manage-typefood.component';
import { OrderMobileComponent } from './components-mobile/order-mobile/order-mobile.component';
import { CartOrderComponent } from './components-mobile/cart-order/cart-order.component';
import { PromotionCustomerComponent } from './components-mobile/promotion-customer/promotion-customer.component';

const routes: Routes = [
  {
    path: 'mobile',
    component: MobileLayoutComponent,
    children: [
      {path: '', component: MenuComponent, pathMatch: 'full'},
      {path:'menu',component:MenuComponent},
      {path:'order',component:OrderMobileComponent},
      {path:'bill',component:BillComponent},
      {path:'foodmenu',component:FoodmenuComponent},
      {path:'cart',component:CartOrderComponent},
      {path:'promotion',component:PromotionCustomerComponent}
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
      {path: 'manageTypefood', component: ManageTypefoodComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
