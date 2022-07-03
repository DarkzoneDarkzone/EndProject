import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UIChart } from 'primeng/chart';


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
  besttypeArr: string[] = []
  bestfood: any
  bestfoodArr: string[] = []
  income: any

  income_month: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0]

  constructor(private callOrderApi: OrderService) { }

  ngOnInit(): void {
    this.getDataDashboardAll()
    this.pieChart()
    this.doughtnutChartType()
    this.doughtnutChartFood()
    this.lineChart()
  }

  public async getDataDashboardAll() {
    await this.callOrderApi.IncomeMonth().toPromise().then(data => {
      this.income = data;
      for (let i = 0; i < this.income.length; i++) {
        let month = new Date(this.income[i].creationDatetime).getMonth()
        this.income_month[month] += this.income[i].priceTotal
      }
      this.lineData.refresh()
    })
    await this.callOrderApi.GetBestFood().toPromise().then(data => {
      this.bestfood = data
      for (let i = 0; i < this.bestfood.length; i++) {
        this.bestfoodArr.push(this.bestfood[i].totalAmount)
      }
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
          data: [90, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
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
