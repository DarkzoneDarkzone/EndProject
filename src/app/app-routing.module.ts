import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { CashierComponent } from './components/cashier/cashier.component';
import { ManageComponent } from './components/manage/manage.component';
import { DrinkComponent } from './components/drink/drink.component';

const routes: Routes = [
  // {path: '', redirectTo: 'manage', pathMatch:'full'},
  {path: 'customer', component: CustomerComponent},
  {path: 'kitchen', component: KitchenComponent},
  {path: 'cashier', component: CashierComponent},
  {path: 'manage', component: ManageComponent},
  {path: 'drink', component: DrinkComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
