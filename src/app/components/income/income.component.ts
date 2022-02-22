import { Component, OnInit } from '@angular/core';

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

  datadoughtnut1: any;
  chartOptionsdoughtnut1: any;

  datadoughtnut2: any;
  chartOptionsdoughtnut2: any;
  constructor() {}

  ngOnInit(): void {
    this.barChart();
    this.pieChart();
    this.doughtnutChart1();
    this.doughtnutChart2();
  }

  pieChart() {
    this.datapie = {
      datasets: [
        {
          data: [300, 50, 100],
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
  doughtnutChart1() {
    this.datadoughtnut1 = {
      datasets: [
        {
          data: [300, 50, 100, 120, 40],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
        },
      ],
    };
    this.chartOptionsdoughtnut1 = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }
  doughtnutChart2() {
    this.datadoughtnut2 = {
      datasets: [
        {
          data: [120, 70, 150, 20, 40],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AB47BC', '#66BB6A'],
        },
      ],
    };
    this.chartOptionsdoughtnut2 = {
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
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
          data: [65, 59, 80, 81, 56, 55, 10],
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
