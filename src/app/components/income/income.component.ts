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
  income_date: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  income_day_of_weeks: number[] = [0, 0, 0, 0, 0, 0, 0]
  income_time: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  type_line_chart: any = "per_month"
  
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
        let date = new Date(this.income[i].creationDatetime).getDate()
        let day_of_week = new Date(this.income[i].creationDatetime).getDay()
        let time_order = new Date(this.income[i].creationDatetime).getHours()
        
        this.setValueIncomeTime(time_order, this.income[i].netPrice)

        this.income_month[month] += this.income[i].netPrice
        this.income_date[date-1] += this.income[i].netPrice
        this.income_day_of_weeks[day_of_week] += this.income[i].netPrice

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

  setValueIncomeTime(hours: any, income: any){
    if(hours === 9){
      this.income_time[0] += income
    }
    if(hours === 10){
      this.income_time[1] += income
    }
    if(hours === 11){
      this.income_time[2] += income
    }
    if(hours === 12){
      this.income_time[3] += income
    }
    if(hours === 13){
      this.income_time[4] += income
    }
    if(hours === 14){
      this.income_time[5] += income
    }
    if(hours === 15){
      this.income_time[6] += income
    }
    if(hours === 16){
      this.income_time[7] += income
    }
    if(hours === 17){
      this.income_time[8] += income
    }
    if(hours === 18){
      this.income_time[9] += income
    }
    if(hours === 19){
      this.income_time[10] += income
    }
    if(hours === 20){
      this.income_time[11] += income
    }
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

  refreshChart(){
    this.lineChart()
  }

  lineChart() {
    let label_current: any
    let value_current: any
    
    const labels_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const labels_date = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '21', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    const labels_day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const labels_time = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'];

    if(this.type_line_chart === "per_month"){
      label_current = labels_month
      value_current = this.income_month
    }
    if(this.type_line_chart === "per_date"){
      label_current = labels_date
      value_current = this.income_date
    }
    if(this.type_line_chart === "per_day"){
      label_current = labels_day
      value_current = this.income_day_of_weeks
    }
    if(this.type_line_chart === "per_time"){
      label_current = labels_time
      value_current = this.income_time
    }

    this.lineData = {
      labels: label_current,
      datasets: [
        {
          label: 'Dataset 1',
          fill: false,
          borderColor: '#42A5F5',
          yAxisID: 'y',
          tension: .4,
          data: value_current
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
