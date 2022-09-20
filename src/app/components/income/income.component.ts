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
  bestfood: any
  bestfoodArr: any[] = []
  income: any
  totalIncome: any = 0
  totalEmp: any
  totalFood: any
  income_month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  this_month: any = new Date().getMonth()
  order_success: any = 0
  order_unsuccess: any = 0
  order_success_price: any = 0
  order_unsuccess_price: any = 0

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
      datasets: [
        {
          data: this.besttypeArr,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
        },
      ],
    };
    this.optionsdoughtnutType = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }
  doughtnutChartFood() {
    this.doughtnutFood = {
      datasets: [
        {
          data: this.bestfoodArr,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
        },
      ],
    };
    this.optionsdoughtnutFood = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
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
