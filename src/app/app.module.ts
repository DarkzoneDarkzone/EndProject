import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { MainEmployeeComponent } from './components/main-employee/main-employee.component';
import { OrderComponent } from './components/order/order.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ManageFoodComponent } from './components/manage-food/manage-food.component';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { ManageTableComponent } from './components/manage-table/manage-table.component';
import { IncomeComponent } from './components/income/income.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PromotionComponent } from './components/promotion/promotion.component';
import { AccordionModule } from 'primeng/accordion'; //accordion and accordion tab
import { ChartModule, UIChart } from 'primeng/chart';
import { OrderChefComponent } from './components/order-chef/order-chef.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { MobileLayoutComponent } from './layouts/mobile-layout/mobile-layout.component';
import { SystemLayoutComponent } from './layouts/system-layout/system-layout.component';
import { BillComponent } from './components-mobile/bill/bill.component';
import { MenuComponent } from './components-mobile/menu/menu.component';
import { FoodmenuComponent } from './components-mobile/foodmenu/foodmenu.component';
import { ManageTypefoodComponent } from './components/manage-typefood/manage-typefood.component';
import { DataService } from './services/data.service';
import { OrderMobileComponent } from './components-mobile/order-mobile/order-mobile.component';
import { CartOrderComponent } from './components-mobile/cart-order/cart-order.component';

import {NgxPrintModule} from 'ngx-print';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    MainEmployeeComponent,
    OrderComponent,
    OrderHistoryComponent,
    ManageFoodComponent,
    ManageEmployeeComponent,
    ManageTableComponent,
    IncomeComponent,
    PromotionComponent,
    OrderChefComponent,
    MobileLayoutComponent,
    SystemLayoutComponent,
    BillComponent,
    MenuComponent,
    FoodmenuComponent,
    ManageTypefoodComponent,
    OrderMobileComponent,
    CartOrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    AccordionModule,
    ChartModule,
    NgxSpinnerModule,
    NgxPrintModule,
    NgxQRCodeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
