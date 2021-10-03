import { Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [
        {
          name: this.selectedCurrency,
          data: this.value,
        },
      ],
      chart: {
        height: 600,
        type: 'line',
      },
      legend: {
        fontSize: '1.2em',
        showForSingleSeries: true,
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: this.date,
      },
      tooltip: {
        x: {
        },
      },
    };
  }
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: any;
  currency = [
    { id: 1, value: 'USD' },
    { id: 2, value: 'EUR' },
    { id: 3, value: 'GBP' },
    { id: 4, value: 'CAD' },
    { id: 5, value: 'PLN' },
    { id: 6, value: 'RUB' },
  ];
  selectedCurrency = 'USD';
  data: any = [];
  date: any = [];
  value: any = [];
  title = 'angular-chart';

  update(event: Event) {
    this.selectedCurrency = (<HTMLSelectElement>event?.target).value;
    console.log(this.selectedCurrency);
    this.data = [];
    this.value = [];
    this.getData().then(() => {
      setTimeout(() => {
        this.chart?.updateSeries([
          {
            data: this.value,
            name: this.selectedCurrency,
          },
        ]);
        console.log(this.value);
      }, 500);
    });
  }

  async getData() {
    let currentMonth = new Date(Date.now()).getMonth() + 1;
    let currentYear = new Date(Date.now()).getFullYear();
    let endDate = new Date(Date.now()).getDate();
    let calledArray = [];
    for (let i = 1; i <= endDate; i++) {
      const call = this.http.get(
        `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${this.selectedCurrency}&date=202109${i}&json`
      );
      this.date.push(`${i}/${currentMonth}/${currentYear}`);
      calledArray.push(call);
    }
    forkJoin([...calledArray]).subscribe((response: any) => {
      this.data.push(...response.flat());
      this.data.forEach((el: any) => {
        return this.value.push(el.rate);
      });
    });
  }
}