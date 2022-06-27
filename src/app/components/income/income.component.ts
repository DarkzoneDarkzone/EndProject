import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent implements OnInit {
  multiAxisData: any;
  multiAxisOptions: any;

  datapie: any;
  chartOptionspie: any;

  doughtnutType: any;
  optionsdoughtnutType: any;

  doughtnutFood: any;
  optionsdoughtnutFood: any;

  besttype: any
  besttypeArr: string[] = []
  bestfood: any
  bestfoodArr: string[] = []
  income: any
  
  constructor(private callOrderApi: OrderService) {}

  ngOnInit(): void {
    this.getDataDashboardAll()
    this.barChart()
    this.pieChart()
    this.doughtnutChartType()
    this.doughtnutChartFood()
  }

  public async getDataDashboardAll(){
    await this.callOrderApi.IncomeMonth().toPromise().then(data => {
      this.income = data;
    })
    await this.callOrderApi.GetBestFood().toPromise().then(data => {
      this.bestfood = data
      for(let i = 0; i < this.bestfood.length; i++){
        this.bestfoodArr.push(this.bestfood[i].totalAmount)
      }
    })
    await this.callOrderApi.GetBestType().toPromise().then(data => {
      this.besttype = data
      for(let i = 0; i < this.besttype.length; i++){
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

  barChart() {
    this.multiAxisData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Dataset 1',
          backgroundColor: [
            '#EC407A',
            '#AB47BC',
            '#42A5F5',
            '#7E57C2',
            '#66BB6A',
            '#FFCA28',
            '#26A69A',
          ],
          yAxisID: 'y',
          data: [65, 59, 80, 81, 56, 55, 10, 80, 81, 56, 55, 10],
        },
      ],
    };

    this.multiAxisOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
        tooltips: {
          mode: 'index',
          intersect: true,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            min: 0,
            max: 100,
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }
}
