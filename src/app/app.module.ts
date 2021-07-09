import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './components/customer/customer.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { CashierComponent } from './components/cashier/cashier.component';
import { ManageComponent } from './components/manage/manage.component';
import { DrinkComponent } from './components/drink/drink.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    KitchenComponent,
    CashierComponent,
    ManageComponent,
    DrinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
