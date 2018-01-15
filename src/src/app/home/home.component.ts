import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  // Chart Labels
  barChartLabels: string[] = [];
  barChartType = 'bar';
  barChartLegend = true;

  // Bar Chart data
  barChartData: any[] = [
    { data: [], label: 'Total Price' }
  ];
  // Pie Chart Data for brands
  pieChartLabels: string[] = [];
  pieChartData: number[] = new Array(10);
  pieChartType = 'pie';

  // lineChart
  lineChartData: Array<any> = [
    { data: [], label: 'Quantity' },
    { data: [], label: 'price' },
  ];
  lineChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true
  };
  lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  lineChartLegend = true;
  lineChartType = 'line';

  snapshots: any;
  products: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getData();
  }
  randomize(): void {
    const _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1); // PULL USER DATA
      }
    }
    this.lineChartData = _lineChartData;
  }

  // Chart events
  chartClicked(e: any): void {
    console.log(e);
  }

  // Chart events
  chartHovered(e: any): void {
    console.log(e);
  }

  getData() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('api/product/snapshot', { headers: headers }).subscribe(
      data => {
        if (data.data.snapshots[0]) {
          this.snapshots = data.data.snapshots;
          this.barChart();
          this.listProducts();
          this.getWarehouses();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  barChart() {
    const _barChartData: Array<any> = new Array(1);
    _barChartData[0] = { data: new Array(Object.keys(this.snapshots).length), label: 'total price' };
    const _barChartLabels = new Array<string>(Object.keys(this.snapshots).length);
    let inventory;
    let snapshot;
    let i = 0;
    for (snapshot of this.snapshots) {
      _barChartData[0].data[i] = 0;
      _barChartLabels[i] = JSON.stringify(snapshot.created_at).slice(1, 11);
      for (inventory of snapshot.inventory) {
        _barChartData[0].data[i] += JSON.parse(inventory.price) * JSON.parse(inventory.quantity);
      }
      i++;
    }
    this.barChartLabels = _barChartLabels;

    // timeout seems to be needed for graph to updated both data and labels
    setTimeout(response => { this.barChartData = _barChartData; }, 0.1);
  }

  getSingleData(id: Number): void {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get('api/product/snapshot/' + id, { headers: headers }).subscribe(
      data => {
        console.log(JSON.stringify(data));
      },
      err => {
        console.log(err);
      }
    );
  }
  listProducts() {
    const l = Object.keys(this.snapshots).length - 1;
    this.products = new Array(Object.keys(this.snapshots[l].inventory).length);
    let i = 0;
    for (const item of this.snapshots[l].inventory) {
      this.products[i++] = item;
    }
  }

  viewProduct(name: string) {
    const _lineChartData: Array<any> = new Array(2);
    _lineChartData[0] = { data: new Array(Object.keys(this.snapshots).length), label: 'quantity of ' + name };
    _lineChartData[1] = { data: new Array(Object.keys(this.snapshots).length), label: 'price of ' + name };
    const _lineChartLabels = new Array<string>(Object.keys(this.snapshots).length);
    let inventory;
    let snapshot;
    let i = 0;
    for (snapshot of this.snapshots) {
      _lineChartData[0].data[i] = 0;
      _lineChartData[1].data[i] = 0;
      _lineChartLabels[i] = JSON.stringify(snapshot.created_at).slice(1, 11);
      for (inventory of snapshot.inventory) {
        if (name === inventory.item_name) {
          _lineChartData[0].data[i] = inventory.quantity;
          _lineChartData[1].data[i] = inventory.price;
        }
      }
      i++;
    }
    this.lineChartLabels = _lineChartLabels;
    // timeout seems to be needed for graph to updated both data and labels
    setTimeout(response => { this.lineChartData = _lineChartData; }, 0.1);
  }

  getWarehouses() {
    const headers = new HttpHeaders({ 'authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) });
    this.http.get<any>('/api/warehouse?limit=10&offset=0', { headers: headers }).subscribe(
      data => {
        this.warehouseTotals(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  warehouseTotals(data: any) {
    if (data.data.warehouses.length > 0) {
      const _pieChartLabels = new Array<string>(Object.keys(data.data.warehouses).length);
      const _pieChartData = new Array(Object.keys(data.data.warehouses).length);
      let i = 0;
      for (const warehouse of data.data.warehouses) {
        _pieChartLabels[i] = warehouse.warehouse_name;
        _pieChartData[i] = 0;
        for (const inventory of this.snapshots[Object.keys(this.snapshots).length - 1].inventory) {
          if (warehouse.id === inventory.warehouse_id) {
            _pieChartData[i] += JSON.parse(inventory.price) * JSON.parse(inventory.quantity);
          }
        }
        i++;
      }
      this.pieChartLabels = _pieChartLabels;
      // timeout seems to be needed for graph to updated both data and labels
      setTimeout(response => { this.pieChartData = _pieChartData; }, 0.1);
    }
  }
}
