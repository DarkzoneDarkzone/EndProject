import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  lineData: any = [];
  lineOption: any;
  datapie: any = [];
  chartOptionspie: any;
  doughtnutType: any = [];
  optionsdoughtnutType: any;
  doughtnutFood: any = [];
  optionsdoughtnutFood: any;
  besttype: any
  besttypeArr: any[] = []
  besttypeColorArr: any[] = []
  bestfood: any
  bestfoodArr: any[] = []
  bestfoodColorArr: any[] = []
  income: any
  totalIncome: any = 0
  totalEmp: any
  totalFood: any
  this_month: any = new Date().getMonth()
  order_success: any = 0
  order_unsuccess: any = 0
  order_success_price: any = 0
  cash_price_all: any = 0
  bank_price_all: any = 0
  order_unsuccess_price: any = 0
  income_month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  cash_price_month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  bank_price_month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  
  constructor(
    private callOrderApi: OrderService, 
    private callEmpApi: EmployeeService, 
    private callFoodApi: FoodService, 
    private spinner: NgxSpinnerService
  ){}

  ngOnInit(): void {
    this.spinner.show();
    Promise.all([this.getDataDashboardAll(), this.doughtnutChartType(), this.doughtnutChartFood()]).then((values) => {
      this.spinner.hide();
    });
  }

  public async getDataDashboardAll() {
    await this.callOrderApi.IncomeMonth().toPromise().then(data => {
      this.income = data;
      for (let i = 0; i < this.income.length; i++) {
        let month = new Date(this.income[i].creationDatetime).getMonth()
        this.income_month[month] += this.income[i].netPrice
        this.totalIncome += this.income[i].netPrice
        if(this.income[i].typePayment === 'payOnsite'){
          this.cash_price_all += this.income[i].netPrice
          this.cash_price_month[month] += this.income[i].netPrice
        }
        if(this.income[i].typePayment === 'payOnline'){
          this.bank_price_all += this.income[i].netPrice
          this.bank_price_month[month] += this.income[i].netPrice
        }
      }
      this.lineChart()
    })
    await this.callOrderApi.GetOrder().toPromise().then((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if(data[i].status == "success"){
          this.order_success += 1
          this.order_success_price += data[i].netPrice
        } else {
          this.order_unsuccess += 1
          this.order_unsuccess_price += data[i].netPrice
        }
      }
      this.pieChart()
    })
    await this.callOrderApi.GetBestFood().toPromise().then(data => {
      this.bestfood = data
      for (let i = 0; i < this.bestfood.length; i++) {
        this.bestfoodArr.push(this.bestfood[i].totalAmount)
        this.bestfoodColorArr.push(this.bestfood[i].color)
      }
    })
    await this.callEmpApi.GetEmployee().toPromise().then((data: any) => {
      this.totalEmp = data.length
    })
    await this.callFoodApi.TotalFood().toPromise().then((data: any) => {
      this.totalFood = data
    })
    await this.callOrderApi.GetBestType().toPromise().then(data => {
      this.besttype = data
      for (let i = 0; i < this.besttype.length; i++) {
        this.besttypeArr.push(this.besttype[i].totalAmount)
        this.besttypeColorArr.push(this.besttype[i].color)
      }
    })
  }

  pieChart() {
    this.datapie = {
      datasets: [
        {
          data: [this.order_success, this.order_unsuccess],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
    this.chartOptionspie = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }
  doughtnutChartType() {
    this.doughtnutType = {
      labels: ['จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น'],
      datasets: [
        {
          data: this.besttypeArr,
          backgroundColor: this.besttypeColorArr,
          hoverBackgroundColor: this.besttypeColorArr,
        },
      ],
    };
    this.optionsdoughtnutType = {
      plugins: {
        legend: {
          display: false
        }
      },
    };
  }
  doughtnutChartFood() {
    this.doughtnutFood = {
      labels: ['จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น','จำนวนชิ้น'],
      datasets: [
        {
          data: this.bestfoodArr,
          backgroundColor: this.bestfoodColorArr,
          hoverBackgroundColor: this.bestfoodColorArr,
        },
      ],
    };
    this.optionsdoughtnutFood = {
      plugins: {
        legend: {
          display: false
        }
      },
    };
  }
  lineChart() {
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Dataset 1',
          fill: false,
          borderColor: '#42A5F5',
          yAxisID: 'y',
          tension: .4,
          data: this.income_month
        },
      ],
    };

    this.lineOption = {
      stacked: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
      }
    };
  }
}
